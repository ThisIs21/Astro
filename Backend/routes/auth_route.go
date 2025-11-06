package routes

import (
    // handler_admin "astro-backend/handler/admin"
	// Repository_admin "astro-backend/repository/admin"
	// service_admin "astro-backend/service/admin"
	handler_auth "astro-backend/handler/auth"
	service_auth "astro-backend/service/auth"
	Repository_admin "astro-backend/repository/admin"

	"github.com/gin-gonic/gin"
)

func AuthRoutes(r *gin.Engine) {
	userRepo := Repository_admin.NewUserRepository()
	authService := service_auth.NewAuthService(userRepo)
	authHandler := handler_auth.NewAuthHandler(authService)

	r.GET("/login", handler_auth.IndexAuth)
	r.POST("/login/do-login", authHandler.Login)

}