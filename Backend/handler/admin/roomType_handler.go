package admin

import (
	"astro-backend/models"
	"astro-backend/service/admin"
	"net/http"

	"github.com/gin-gonic/gin"
)

type RoomTypeHandler struct {
	services admin.RoomTypeService
}

func NewRoomTypeHandler(s admin.RoomTypeService) RoomTypeHandler {
	return RoomTypeHandler{s}
}	

func (h RoomTypeHandler) GetAllRoomTypes(c *gin.Context) {
	roomTypes, err := h.services.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve room types"})
		return
	}
	if len(roomTypes) == 0 {
		c.JSON(http.StatusOK, gin.H{"message": "Data Room Types Kosong"})
		return
	}
	c.JSON(http.StatusOK, roomTypes)
}
func (h RoomTypeHandler) CreateRoomType(c *gin.Context) {
	var roomType models.RoomType
	if err := c.ShouldBindJSON(&roomType); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	createdRoomType, err := h.services.Create(roomType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create room type"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": createdRoomType, "message": "Room type created successfully"})
}
func (h RoomTypeHandler) UpdateRoomType(c *gin.Context) {
	id := c.Param("id")
	var roomType models.RoomType

	if err := c.ShouldBindJSON(&roomType); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}
	if err := h.services.Update(id, roomType); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update room type"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Room type updated successfully"})

}
func (h RoomTypeHandler) DeleteRoomType(c *gin.Context) {

	id := c.Param("id")
	if err := h.services.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete room type"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Room type deleted successfully"})
}