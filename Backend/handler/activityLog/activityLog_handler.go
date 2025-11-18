// handler/activityLog/handler.go

package activityLog

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-contrib/ratelimit"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"yourproject/models" // Adjust to your project import path
	"yourproject/service" // Adjust to your project import path
)

type ActivityLogHandler struct {
	service service.ActivityLogService
}

func NewActivityLogHandler(service service.ActivityLogService) *ActivityLogHandler {
	return &ActivityLogHandler{service: service}
}

// GetLogs handles GET /api/v1/admin/logs
func (h *ActivityLogHandler) GetLogs(c *gin.Context) {
	var filter models.LogFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid filter parameters"})
		return
	}
	pageStr := c.Query("page")
	limitStr := c.Query("limit")
	page, _ := strconv.ParseInt(pageStr, 10, 64)
	if page < 1 {
		page = 1
	}
	limit, _ := strconv.ParseInt(limitStr, 10, 64)
	if limit < 1 {
		limit = 10
	}
	logs, total, err := h.service.GetLogsByCriteria(filter, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch logs"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"logs": logs, "total": total})
}

// GetLogStats handles GET /api/v1/admin/logs/stats
func (h *ActivityLogHandler) GetLogStats(c *gin.Context) {
	stats, err := h.service.GetLogStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch stats"})
		return
	}
	c.JSON(http.StatusOK, stats)
}

// DeleteLogsByRange handles DELETE /api/v1/admin/logs/range
func (h *ActivityLogHandler) DeleteLogsByRange(c *gin.Context) {
	startStr := c.Query("start_date")
	endStr := c.Query("end_date")
	start, err := time.Parse(time.RFC3339, startStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start_date"})
		return
	}
	end, err := time.Parse(time.RFC3339, endStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end_date"})
		return
	}
	// Assume requestedBy from auth middleware, e.g., c.Get("user_id")
	requestedBy, _ := primitive.ObjectIDFromHex("example_admin_id") // Replace with actual
	result, err := h.service.DeleteLogsByDateRange(start, end, requestedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete logs"})
		return
	}
	c.JSON(http.StatusOK, result)
}

// DeleteLogsBatch handles DELETE /api/v1/admin/logs/batch
func (h *ActivityLogHandler) DeleteLogsBatch(c *gin.Context) {
	var req struct {
		IDs []string `json:"ids"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}
	var ids []primitive.ObjectID
	for _, idStr := range req.IDs {
		id, err := primitive.ObjectIDFromHex(idStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
			return
		}
		ids = append(ids, id)
	}
	requestedBy, _ := primitive.ObjectIDFromHex("example_admin_id") // Replace with actual
	result, err := h.service.DeleteLogsByIDs(ids, requestedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete logs"})
		return
	}
	c.JSON(http.StatusOK, result)
}

// DeleteLogsByUser handles DELETE /api/v1/admin/logs/user/:userId
func (h *ActivityLogHandler) DeleteLogsByUser(c *gin.Context) {
	userIdStr := c.Param("userId")
	userID, err := primitive.ObjectIDFromHex(userIdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}
	requestedBy, _ := primitive.ObjectIDFromHex("example_admin_id") // Replace with actual
	result, err := h.service.DeleteLogsByUser(userID, requestedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete logs"})
		return
	}
	c.JSON(http.StatusOK, result)
}

// TriggerCleanup handles POST /api/v1/admin/logs/cleanup
func (h *ActivityLogHandler) TriggerCleanup(c *gin.Context) {
	retentionStr := c.Query("retention_days")
	retention, err := strconv.Atoi(retentionStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid retention_days"})
		return
	}
	result, err := h.service.AutoCleanup(retention)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to perform cleanup"})
		return
	}
	c.JSON(http.StatusOK, result)
}

// GetCleanupConfig handles GET /api/v1/admin/logs/config
func (h *ActivityLogHandler) GetCleanupConfig(c *gin.Context) {
	// Assume config stored somewhere; for example, return defaults
	config := models.CleanupConfig{
		RetentionDays: 90,
		Enabled:       true,
		Schedule:      "0 2 * * *",
	}
	c.JSON(http.StatusOK, config)
}

// UpdateCleanupConfig handles PUT /api/v1/admin/logs/config
func (h *ActivityLogHandler) UpdateCleanupConfig(c *gin.Context) {
	var config models.CleanupConfig
	if err := c.ShouldBindJSON(&config); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid config"})
		return
	}
	// Update config logic; for now, assume success
	// In real, update env or db config
	c.JSON(http.StatusOK, gin.H{"message": "Config updated"})
}

// Note: Add admin auth middleware and rate limiting in routes