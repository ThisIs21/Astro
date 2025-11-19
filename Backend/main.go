package main

import (
	"astro-backend/config"
	"astro-backend/routes"
	"astro-backend/middleware"

	activityRepo "astro-backend/repository/activityLog"
	activityService "astro-backend/service/activityLog"

	"fmt"
	"log"
	"os"
	"time"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	// === 1. Load environment ===
	if err := config.LoadEnv(); err != nil {
		log.Fatalf("❌ Failed loading .env: %v", err)
	}

	// === 2. Connect MongoDB ===
	config.ConnectDB()
	defer config.CloseDB()

	db := config.GetMongoDB()
	if db == nil {
		log.Fatalf("❌ MongoDB is nil. Check connection.")
	}

	// === 3. Setup Gin Mode ===
	ginMode := os.Getenv("GIN_MODE")
	if ginMode == "" {
		ginMode = gin.ReleaseMode
	}
	gin.SetMode(ginMode)

	r := gin.Default()

	// === 4. Init Activity Log Dependencies ===

	collectionName := os.Getenv("ACTIVITY_LOG_COLLECTION")
	if collectionName == "" {
		collectionName = "activity_logs" // default fallback
	}

	// repo butuh (db, collectionName)
	aRepo := activityRepo.NewActivityLogRepository(db, collectionName)

	// service butuh (repo, retentionDays, cleanupInterval)
	batchSize := 1
	flushTimeout := 2 * time.Second
	aService := activityService.NewActivityLogService(aRepo, batchSize, flushTimeout)
	// === 5. Register Middlewares ===
	r.Use(gin.WrapH(
		middleware.ActivityLoggerMiddleware(aService)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// pass-through handler for gin, this will be replaced by Gin router
			// we just need a wrapper for middleware
		})),
	))
	// === 6. Register Routes ===
	routes.AuthRoutes(r)
	routes.AdminRoutes(r)

	// === 7. Run Server ===
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("🚀 Server running on port %s\n", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("❌ Failed starting server: %v", err)
	}
}
