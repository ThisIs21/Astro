package middleware

import (
	"astro-backend/service/activityLog"
	"astro-backend/models"
	"time"
	"fmt"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func ActivityLogger(logService activityLog.ActivityLogService) gin.HandlerFunc {
	return func(c *gin.Context) {
		time.Now()

		c.Next()

		ip := c.ClientIP()
		method := c.Request.Method
		path := c.Request.URL.Path
		statusCode := c.Writer.Status()
		userAgent := c.Request.UserAgent()

		var userID *primitive.ObjectID
		if uid, exists := c.Get("userId"); exists {
			if idStr, ok := uid.(string); ok {
				objID, _ := primitive.ObjectIDFromHex(idStr)
				userID = &objID
			}
		}

		log := models.ActivityLog{
			ID:        primitive.NewObjectID(),
			UserID:    userID,
			IPAddress:        ip,
			UserAgent: userAgent,
			Method:    method,
			Endpoint:  path,
			Status:    fmt.Sprintf("%d", statusCode), // convert int → string
			CreatedAt: time.Now().UTC(),
		}

		// run async so request not delayed
			go func() {
		_ = logService.WriteLog(
			log.UserID,
			log.SessionID,
			log.Action,
			log.Endpoint,
			log.Method,
			log.IPAddress,
			log.UserAgent,
			log.Status,
			log.Message,
		)
		}()

	}
}
