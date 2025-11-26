package activityLog

import (
	"encoding/csv"
	"net/http"
	"strconv"
	"time"

	"astro-backend/service/activityLog"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
	"go.mongodb.org/mongo-driver/bson"
)

/* ===========================
        Handler Struct
=========================== */

type ActivityLogHandler struct {
	Svc activityLog.ActivityLogService
}

func NewActivityLogHandler(svc activityLog.ActivityLogService) *ActivityLogHandler {
	return &ActivityLogHandler{Svc: svc}
}

/* ===========================
        List / Pagination
=========================== */

func (h *ActivityLogHandler) List(c *gin.Context) {
	q := c.Request.URL.Query()

	page := parseInt(q.Get("page"), 1)
	limit := int64(parseInt(q.Get("limit"), 20))
	if limit <= 0 || limit > 1000 {
		limit = 20
	}

	skip := int64((page - 1)) * limit

	sortBy := q.Get("sort_by")
	sortOrder := 1
	if q.Get("sort_order") == "desc" {
		sortOrder = -1
	}

	filter := bson.M{}

	if v := q.Get("category"); v != "" {
		filter["category"] = v
	}
	if v := q.Get("action"); v != "" {
		filter["action_type"] = v
	}
	if v := q.Get("ip"); v != "" {
		filter["ip_address"] = v
	}
	if v := q.Get("user_id"); v != "" {
		filter["user_id"] = v
	}

	entries, total, err := h.Svc.Search(
		c,
		filterToMap(filter),
		sortBy,
		sortOrder,
		limit,
		skip,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	totalPages := (total + limit - 1) / limit

	c.JSON(http.StatusOK, gin.H{
		"data":         entries,
		"total":        total,
		"current_page": page,
		"per_page":     limit,
		"total_pages":  totalPages,
	})
}

/* ===========================
        Detail
=========================== */

func (h *ActivityLogHandler) Detail(c *gin.Context) {
	id := c.Param("id")

	entry, err := h.Svc.GetByID(c, id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "log not found",
		})
		return
	}

	c.JSON(http.StatusOK, entry)
}

/* ===========================
        Search (Advanced)
=========================== */

func (h *ActivityLogHandler) Search(c *gin.Context) {
	q := c.Request.URL.Query()
	filter := bson.M{}

	// Date Range
	if dr := q.Get("date_from"); dr != "" {
		if t, err := time.Parse(time.RFC3339, dr); err == nil {
			filter["created_at"] = bson.M{"$gte": t}
		}
	}
	if dr := q.Get("date_to"); dr != "" {
		if t, err := time.Parse(time.RFC3339, dr); err == nil {
			if fa, ok := filter["created_at"].(bson.M); ok {
				fa["$lte"] = t
			} else {
				filter["created_at"] = bson.M{"$lte": t}
			}
		}
	}

	// General filters
	if v := q.Get("user_id"); v != "" {
		filter["user_id"] = v
	}
	if v := q.Get("ip"); v != "" {
		filter["ip_address"] = v
	}
	if v := q.Get("action"); v != "" {
		filter["action_type"] = v
	}
	if v := q.Get("endpoint"); v != "" {
		filter["endpoint"] = v
	}

	// Fulltext search
	if v := q.Get("q"); v != "" {
		filter["$text"] = bson.M{"$search": v}
	}

	limit := int64(parseInt(q.Get("limit"), 50))
	skip := int64(parseInt(q.Get("skip"), 0))
	sortBy := q.Get("sort_by")

	sortOrder := 1
	if q.Get("sort_order") == "desc" {
		sortOrder = -1
	}

	entries, total, err := h.Svc.Search(
		c,
		filterToMap(filter),
		sortBy,
		sortOrder,
		limit,
		skip,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  entries,
		"total": total,
	})
}

/* ===========================
        Dashboard Placeholder
=========================== */

func (h *ActivityLogHandler) Dashboard(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"note": "Implement dashboard aggregation pipeline in repository.",
	})
}

/* ===========================
        Security Alerts
=========================== */

func (h *ActivityLogHandler) SecurityAlerts(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"note": "Implement failed login detection & suspicious access reports.",
	})
}

/* ===========================
        Export CSV
=========================== */

func (h *ActivityLogHandler) Export(c *gin.Context) {
	q := c.Request.URL.Query()
	filter := bson.M{}

	if v := q.Get("category"); v != "" {
		filter["category"] = v
	}

	entries, _, err := h.Svc.Search(
		c,
		filterToMap(filter),
		"created_at",
		-1,
		10000,
		0,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Header("Content-Type", "text/csv")
	c.Header("Content-Disposition", "attachment; filename=activity_logs.csv")

	cw := csv.NewWriter(c.Writer)

	_ = cw.Write([]string{
		"id","created_at","category","action_type","endpoint","method",
		"ip_address","user_email","resource","resource_id","status","message",
	})

	for _, e := range entries {
		_ = cw.Write([]string{
			e.ID.Hex(),
			e.CreatedAt.Format(time.RFC3339),
			e.Category,
			e.ActionType,
			e.Endpoint,
			e.Method,
			e.IPAddress,
			e.UserEmail,
			e.Resource,
			e.ResourceID,
			e.Status,
			e.Message,
		})
	}

	cw.Flush()

	if err := cw.Error(); err != nil {
		log.Error().Err(err).Msg("csv write error")
	}
}

/* ===========================
        Helpers
=========================== */

func parseInt(s string, def int) int {
	i, err := strconv.Atoi(s)
	if err != nil {
		return def
	}
	return i
}

func filterToMap(b bson.M) map[string]any {
	m := map[string]any{}
	for k, v := range b {
		m[k] = v
	}
	return m
}
