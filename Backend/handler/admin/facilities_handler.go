package admin

import (
	"astro-backend/models"
	"astro-backend/service/admin"
	"net/http"

	"github.com/gin-gonic/gin"
)

type FacilitiesHandler struct {
	services admin.FacilityService
}
func NewFacilitiesHandler(s admin.FacilityService) FacilitiesHandler {
	return FacilitiesHandler{s}
}

func (h FacilitiesHandler) GetAllFacilities(c *gin.Context) {
	facilities, err := h.services.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve facilities"})
		return
	}
	if len(facilities) == 0 {
		c.JSON(http.StatusOK, gin.H{"message": "Data Facilities Kosong"})
		return
	}
	c.JSON(http.StatusOK, facilities)
}
func (h FacilitiesHandler) CreateFacility(c *gin.Context) {
	var facility models.Facility

	if err := c.ShouldBindJSON(&facility); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
	}

	createdFacility, err := h.services.Create(facility)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create facility"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data" : createdFacility, "message" : "Add data facilities succsess" })
}
func (h FacilitiesHandler) UpdateFacility(c *gin.Context) {
	id := c.Param("id")
	var facility models.Facility

	if err := c.ShouldBindJSON(&facility); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}
	if err := h.services.Update(id, facility); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update facility"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data" : facility, "message" : "Update data facility succsess"})
}
func (h FacilitiesHandler) DeleteFacility(c *gin.Context) {
	id := c.Param("id")
	if err := h.services.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete facility"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Facility deleted successfully"})
}