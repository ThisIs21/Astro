package main

import (
    "astro-backend/config"
    "astro-backend/routes"

    "fmt"
    "log"
    "os"

    "github.com/gin-gonic/gin"
    // Import CORS middleware
    "github.com/gin-contrib/cors" 
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

    // --- 3.1. SETUP CORS ---
    // Konfigurasi ini mengizinkan permintaan dari domain manapun saat pengembangan
    configCORS := cors.DefaultConfig()
    configCORS.AllowOrigins = []string{"http://localhost:5173"} 
    configCORS.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
    // Penting untuk mengizinkan Content-Type karena kita mengirim JSON
    configCORS.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
    configCORS.AllowCredentials = true
    r.Use(cors.New(configCORS))
    // --- END SETUP CORS ---

    r.Static("/uploads", "./uploads") //meh bisa manggil foto

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