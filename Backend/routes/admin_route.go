package routes

import (
    handler_admin "astro-backend/handler/admin"
	Repository_admin "astro-backend/repository/admin"
	service_admin "astro-backend/service/admin"

	"github.com/gin-gonic/gin"
)

func AdminRoutes(r *gin.Engine) {
	userRepo := Repository_admin.NewUserRepository()
	userService := service_admin.NewUserService(userRepo)
	userHandler := handler_admin.NewUserHandler(userService)

	admin := r.Group("/admin")
	{
		admin.GET("/user", handler_admin.IndexUser)
		admin.POST("/create-user", userHandler.CreateUser)
		admin.POST("/edit-user/:id", userHandler.UpdateUser)
		admin.DELETE("/delete-user/:id", userHandler.DeleteUser)
	}
}