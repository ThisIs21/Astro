package admin

import (
	"astro-backend/service/admin"
	"github.com/gin-gonic/gin"
	"fmt"
	"strconv"
	"time"

	"net/http"
    "path/filepath"
    "os"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

type RoomHandler struct {
	service admin.RoomService
}

func NewRoomHandler(service admin.RoomService) *RoomHandler {
	return &RoomHandler{service}
}

func (h *RoomHandler) CreateRoom(c *gin.Context) {
	// HARUS multipart form
	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Form-data tidak valid, gunakan multipart/form-data"})
		return
	}

	// Ambil fields text
	name := c.PostForm("name")
	description := c.PostForm("description")
	roomNumber := c.PostForm("room_number")
	priceStr := c.PostForm("price")
	TypeID := c.PostForm("room_type_id")
	capacityStr := c.PostForm("capacity")
	bedType := c.PostForm("bed_type")
	category := c.PostForm("category")
	facID := c.PostFormArray("facilities_id")

	// Convert angka
	price, _ := strconv.ParseFloat(priceStr, 64)
	capacity, _ := strconv.Atoi(capacityStr)

	// Ambil banyak gambar
	files := form.File["images"] // BUKAN "images[]"

	if len(files) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Minimal upload 1 gambar"})
		return
	}

	imagePaths := []string{}

	for _, file := range files {
		filename := fmt.Sprintf("uploads/rooms/%d_%s", time.Now().Unix(), file.Filename)

		if err := c.SaveUploadedFile(file, filename); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal upload gambar"})
			return
		}

		imagePaths = append(imagePaths, filename)
	}

	// Kirim ke service
	err = h.service.CreateRoom(name, description, roomNumber, price, TypeID, capacity, bedType, category, facID, imagePaths)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Room berhasil dibuat!"})
}

func (h *RoomHandler) GetAll(c *gin.Context) {
	rooms, err := h.service.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, rooms)
}

func (h *RoomHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	if err := h.service.DeleteRoom(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Room deleted"})
}
func (h *RoomHandler) Update(c *gin.Context) {
	id := c.Param("id")

	name := c.PostForm("name")
	description := c.PostForm("description")
	roomNumber := c.PostForm("room_number")
	price, _ := strconv.ParseFloat(c.PostForm("price_per_night"), 64)
	TypeID := c.PostForm("room_type_id")
	capacity, _ := strconv.Atoi(c.PostForm("capacity"))
	bedType := c.PostForm("bed_type")
	category := c.PostForm("category")
	facID := c.PostFormArray("facilities_id")

	// Ambil file images
	form, _ := c.MultipartForm()
	files := form.File["images"]

	var imagePaths []string
	for _, file := range files {
		filename := primitive.NewObjectID().Hex() + filepath.Ext(file.Filename)
		savePath := filepath.Join("uploads/rooms", filename)

		os.MkdirAll("uploads/rooms", os.ModePerm)
		if err := c.SaveUploadedFile(file, savePath); err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		imagePaths = append(imagePaths, "/uploads/rooms/"+filename)
	}

	// Kirim data ke service (service cukup terima data jadi)
	err := h.service.UpdateRoom(id, name, description, roomNumber, price, TypeID, capacity, bedType, category, facID, imagePaths)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Room updated successfully"})
}


