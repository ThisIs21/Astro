package main

import (
	"astro-backend/config"
	"astro-backend/routes"

	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	// === 1. LOAD ENV FILE ===
	if err := config.LoadEnv(); err != nil {
		log.Fatalf("❌ Gagal load .env: %v", err)
	}

	// === 2. KONEKSI MONGODB ===
	config.ConnectDB()
	defer config.CloseDB()

	// === 3. SETUP GIN ===
	ginMode := os.Getenv("GIN_MODE")
	if ginMode == "" {
		ginMode = gin.ReleaseMode // default
	}
	gin.SetMode(ginMode)

	r := gin.Default()
	// === 4. SETUP ROUTES ===
   routes.AuthRoutes(r)
   routes.AdminRoutes(r)


	// === 5. RUN SERVER ===
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // default port
	}
	fmt.Printf("🚀 Server running on port %s\n", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("❌ Gagal menjalankan server: %v", err)
	}
}
