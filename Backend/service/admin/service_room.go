package admin

import (
	"astro-backend/models"
	// "fmt"
	"time"
	"errors"

	

	"go.mongodb.org/mongo-driver/bson/primitive"
	"astro-backend/repository/admin"
)

type RoomService interface {
	CreateRoom(name, description, roomNumber string, price float64, roomType string, capacity int, bedType, category string, facilities, images []string) error
	UpdateRoom(id string, name, description, roomNumber string, price float64, roomType string, capacity int, bedType, category string, facilities, images []string) error
	Delete(id string) error
	GetAll() ([]models.Room, error)
	GetByID(id string) (models.Room, error)
}

type roomService struct {
	repo admin.RoomRepository
}

func NewRoomService(repo admin.RoomRepository) RoomService {
	return &roomService{repo}
}

func (s *roomService) CreateRoom(name, description, roomNumber string, price float64, roomType string, capacity int, bedType, category string, facilities, images []string) error {

    room := models.Room{
        Id:            primitive.NewObjectID(),
        Name:          name,
        Description:   description,
        RoomNumber:    roomNumber,
        PricePerNight: price,
        Type:          roomType,
        Capacity:      capacity,
        Bed_type:       bedType,
        Category:      category,
        Facilities:    facilities,
        Images:        images,
        Availability:  true,
        CreatedAt:     primitive.NewDateTimeFromTime(time.Now()),
    }

    return s.repo.Create(room)
}

func (s *roomService) UpdateRoom(id string, name, description, roomNumber string, price float64,
	roomType string, capacity int, bedType, category string, facilities, images []string) error {

	// Dapatkan room lama
	room, err := s.repo.GetByID(id)
	if err != nil {
		return errors.New("room not found")
	}

	// Update field
	room.Name = name
	room.Description = description
	room.RoomNumber = roomNumber
	room.PricePerNight = price
	room.Type = roomType
	room.Capacity = capacity
	room.Bed_type = bedType
	room.Category = category
	room.Facilities = facilities

	if len(images) > 0 {
		room.Images = images // replace images
	}

	room.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())

	return s.repo.Update(id, room)
}


func (s *roomService) DeleteRoom(id string) error {
	return s.repo.Delete(id)
}

func (s *roomService) GetAll() ([]models.Room, error) {
	return s.repo.GetAll()
}

func (s *roomService) Delete(id string) error {
	return s.repo.Delete(id)
}
func (s *roomService) GetByID(id string) (models.Room, error) {
	return s.repo.GetByID(id)
}
