package routes

import (
	handler_admin_user "astro-backend/handler/admin"
	repository_admin_user "astro-backend/repository/admin"
	service_admin_user "astro-backend/service/admin"

	service_admin_room "astro-backend/service/admin"
	handler_admin_room "astro-backend/handler/admin"
	repository_admin_room "astro-backend/repository/admin"


	"github.com/gin-gonic/gin"
)

func AdminRoutes(r *gin.Engine) {
	// ------User--------
	userRepo := repository_admin_user.NewUserRepository()
	userService := service_admin_user.NewUserService(userRepo)
	userHandler := handler_admin_user.NewUserHandler(userService)
	// -------Room---------
	RoomRepo := repository_admin_room.NewRoomRepository()
	RoomService := service_admin_room.NewRoomService(RoomRepo)
	RoomHandler := handler_admin_room.NewRoomHandler(RoomService)

	admin := r.Group("/admin")
	{
		//  -----User-----
		admin.GET("/user", userHandler.GetAllUsers)
		admin.POST("/create-user", userHandler.CreateUser)
		admin.POST("/edit-user/:id", userHandler.UpdateUser)
		admin.DELETE("/delete-user/:id", userHandler.DeleteUser)
		// -------Room-------
		admin.GET("/room",RoomHandler.GetAll)
		admin.POST("/create-room", RoomHandler.CreateRoom)
		admin.POST("/edit-room/:id", RoomHandler.Update)
		admin.POST("/delete-room/:id", RoomHandler.Delete)
	}
}
