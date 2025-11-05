package main

import (
	"astro-backend/config"
	"astro-backend/handler/admin"

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

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	// === 4. ROUTE DASAR ===
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "🚀 Backend Hotel Lembang SIAP dan Stabil!",
		})
	})

	router.GET("/admin/users", admin.IndexUser)
	router.POST("/admin/tambah-users/", admin.CreateUser)

	// === 6. JALANKAN SERVER ===
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("✅ Server berjalan di http://localhost:%s\n", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("❌ Gagal menjalankan server: %v", err)
	}
}
