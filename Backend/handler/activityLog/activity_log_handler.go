package activityLog

import (
	// "context"
	"encoding/csv"
	"encoding/json"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/zerolog/log"
	"go.mongodb.org/mongo-driver/bson"

	// "astro-backend/constants"
	"astro-backend/service/activityLog"
)

/* ===========================
        Middleware
=========================== */

func AdminAuth(next http.Handler) http.Handler {
	token := getEnv("ADMIN_API_TOKEN", "")
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if token == "" {
			http.Error(w, "admin token not configured", http.StatusInternalServerError)
			return
		}
		if r.Header.Get("Authorization") != "Bearer "+token {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

/* ===========================
        Handler Struct
=========================== */

type ActivityLogHandler struct {
	Svc activityLog.ActivityLogService
}

func NewActivityLogHandler(svc activityLog.ActivityLogService) *ActivityLogHandler {
	return &ActivityLogHandler{Svc: svc}
}

func (h *ActivityLogHandler) RegisterRoutes(r *mux.Router) {
	ar := r.PathPrefix("/api/admin/activity-logs").Subrouter()
	ar.Use(AdminAuth)
	ar.HandleFunc("", h.List).Methods("GET")
	ar.HandleFunc("/search", h.Search).Methods("GET")
	ar.HandleFunc("/dashboard", h.Dashboard).Methods("GET")
	ar.HandleFunc("/security-alerts", h.SecurityAlerts).Methods("GET")
	ar.HandleFunc("/export", h.Export).Methods("GET")
	ar.HandleFunc("/{id}", h.Detail).Methods("GET")
}

/* ===========================
        Handlers
=========================== */

func (h *ActivityLogHandler) List(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
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

	if cat := q.Get("category"); cat != "" {
		filter["category"] = cat
	}
	if action := q.Get("action"); action != "" {
		filter["action_type"] = action
	}
	if ip := q.Get("ip"); ip != "" {
		filter["ip_address"] = ip
	}
	if uid := q.Get("user_id"); uid != "" {
		filter["user_id"] = uid
	}

	entries, total, err := h.Svc.Search(r.Context(), filterToMap(filter), sortBy, sortOrder, limit, skip)
	if err != nil {
		http.Error(w, "search error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	totalPages := (total + limit - 1) / limit

	resp := map[string]any{
		"data":         entries,
		"total":        total,
		"current_page": page,
		"per_page":     limit,
		"total_pages":  totalPages,
	}

	writeJSON(w, resp)
}

func (h *ActivityLogHandler) Detail(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	entry, err := h.Svc.GetByID(r.Context(), id)
	if err != nil {
		http.Error(w, "not found: "+err.Error(), http.StatusNotFound)
		return
	}
	writeJSON(w, entry)
}

func (h *ActivityLogHandler) Search(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	filter := bson.M{}

	if dr := q.Get("date_from"); dr != "" {
		if t, err := time.Parse(time.RFC3339, dr); err == nil {
			filter["created_at"] = bson.M{"$gte": t}
		}
	}
	if dr := q.Get("date_to"); dr != "" {
		if t, err := time.Parse(time.RFC3339, dr); err == nil {
			if fa, ok := filter["created_at"].(bson.M); ok {
				fa["$lte"] = t
				filter["created_at"] = fa
			} else {
				filter["created_at"] = bson.M{"$lte": t}
			}
		}
	}

	if userID := q.Get("user_id"); userID != "" {
		filter["user_id"] = userID
	}
	if ip := q.Get("ip"); ip != "" {
		filter["ip_address"] = ip
	}
	if action := q.Get("action"); action != "" {
		filter["action_type"] = action
	}
	if endpoint := q.Get("endpoint"); endpoint != "" {
		filter["endpoint"] = endpoint
	}

	if qstr := q.Get("q"); qstr != "" {
		filter["$text"] = bson.M{"$search": qstr}
	}

	limit := int64(parseInt(q.Get("limit"), 50))
	skip := int64(parseInt(q.Get("skip"), 0))
	sortBy := q.Get("sort_by")

	sortOrder := 1
	if q.Get("sort_order") == "desc" {
		sortOrder = -1
	}

	entries, total, err := h.Svc.Search(r.Context(), filterToMap(filter), sortBy, sortOrder, limit, skip)
	if err != nil {
		http.Error(w, "search error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	writeJSON(w, map[string]any{
		"data": entries,
		"total": total,
	})
}

func (h *ActivityLogHandler) Dashboard(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, map[string]any{
		"note": "Implement aggregation pipeline in repository for production dashboard.",
	})
}

func (h *ActivityLogHandler) SecurityAlerts(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, map[string]any{
		"note": "Implement failed login + suspicious IP detection using aggregation.",
	})
}

func (h *ActivityLogHandler) Export(w http.ResponseWriter, r *http.Request) {
	filter := bson.M{}
	q := r.URL.Query()

	if category := q.Get("category"); category != "" {
		filter["category"] = category
	}

	entries, _, err := h.Svc.Search(r.Context(), filterToMap(filter), "created_at", -1, 10000, 0)
	if err != nil {
		http.Error(w, "export error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/csv")
	w.Header().Set("Content-Disposition", "attachment; filename=activity_logs.csv")

	cw := csv.NewWriter(w)
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

func getEnv(k, def string) string {
	v := os.Getenv(k)
	if v == "" {
		return def
	}
	return v
}

func parseInt(s string, def int) int {
	if s == "" {
		return def
	}
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

func writeJSON(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(v)
}