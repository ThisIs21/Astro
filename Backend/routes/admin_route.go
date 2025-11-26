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

	handler_activityLog "astro-backend/handler/activityLog"
	repository_activityLog "astro-backend/repository/activityLog"
	service_activityLog "astro-backend/service/activityLog"

	"github.com/gin-gonic/gin"
	"time"
	"go.mongodb.org/mongo-driver/mongo"
	
)

func AdminRoutes(r *gin.Engine,mongoDB *mongo.Database) {

	
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
	// ---------Activity Logs-------
	ActivityRepo := repository_activityLog.NewActivityLogRepository(mongoDB, "activity_logs")
	ActivityService := service_activityLog.NewActivityLogService(
		ActivityRepo,
		7,         // retention days
		time.Hour, // cleanup interval
	)
	ActivityHandler := handler_activityLog.NewActivityLogHandler(ActivityService)


	

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
		// -------Activity Logs-------
		// -------Activity Logs-------
		admin.GET("/activity-logs", ActivityHandler.List)
		admin.GET("/activity-logs/search", ActivityHandler.Search)
		admin.GET("/activity-logs/:id", ActivityHandler.Detail)
		admin.GET("/activity-logs-dashboard", ActivityHandler.Dashboard)
		admin.GET("/activity-logs/security-alerts", ActivityHandler.SecurityAlerts)
		admin.GET("/activity-logs-export", ActivityHandler.Export)

	}
}
