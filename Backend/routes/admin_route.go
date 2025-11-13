package routes

import (
	handler_admin_user "astro-backend/handler/admin"
	repository_admin_user "astro-backend/repository/admin"
	service_admin_user "astro-backend/service/admin"

	handler_admin_room "astro-backend/handler/admin"
	repository_admin_room "astro-backend/repository/admin"
	service_admin_room "astro-backend/service/admin"

	handker_admin_facility "astro-backend/handler/admin"
	repository_admin_facility "astro-backend/repository/admin"
	service_admin_facility "astro-backend/service/admin"

	handler_admin_roomType "astro-backend/handler/admin"
	repository_admin_roomType "astro-backend/repository/admin"
	service_admin_roomType "astro-backend/service/admin"

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
	// --------Facility--------
	FacilityRepo := repository_admin_facility.NewFacilityRepository()
	FacilityService := service_admin_facility.NewFacilityService(FacilityRepo)
	FacilityHandler := handker_admin_facility.NewFacilitiesHandler(FacilityService)
	// -------Room Type---------
	RoomTypeRepo := repository_admin_roomType.NewRoomTypeRepository()
	RoomTypeService := service_admin_roomType.NewRoomTypeService(RoomTypeRepo)
	RoomTypeHandler := handler_admin_roomType.NewRoomTypeHandler(RoomTypeService)

	admin := r.Group("/admin")
	{
		//  -----User-----
		admin.GET("/user", userHandler.GetAllUsers)
		admin.POST("/create-user", userHandler.CreateUser)
		admin.POST("/edit-user/:id", userHandler.UpdateUser)
		admin.DELETE("/delete-user/:id", userHandler.DeleteUser)
		// -------Room-------
		admin.GET("/room", RoomHandler.GetAll)
		admin.POST("/create-room", RoomHandler.CreateRoom)
		// admin.GET("/room-by-id/:id", RoomHandler.get)
		admin.POST("/edit-room/:id", RoomHandler.Update)
		admin.DELETE("/delete-room/:id", RoomHandler.Delete)
		// -------Facility-------
		admin.GET("/facility", FacilityHandler.GetAllFacilities)
		admin.POST("/create-facility", FacilityHandler.CreateFacility)
		admin.POST("/edit-facility/:id", FacilityHandler.UpdateFacility)
		admin.DELETE("/delete-facility/:id", FacilityHandler.DeleteFacility)
		// -------Room Type-------
		admin.GET("/room-type", RoomTypeHandler.GetAllRoomTypes)
		admin.POST("/create-room-type", RoomTypeHandler.CreateRoomType)
		admin.POST("/edit-room-type/:id", RoomTypeHandler.UpdateRoomType)
		admin.DELETE("/delete-room-type/:id", RoomTypeHandler.DeleteRoomType)
	}
}
