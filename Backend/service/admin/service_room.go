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
	CreateRoom(name, description, roomNumber string, price float64, typeID string, capacity int, bedType, category string, facIDs, images []string) error
	UpdateRoom(id string, name, description, roomNumber string, price float64, typeID string, capacity int, bedType, category string, facIDs, images []string) error
	DeleteRoom(id string) error
	GetAll() ([]models.Room, error)
	GetByID(id string) (models.Room, error)
}


type roomService struct {
	repo admin.RoomRepository
}

func NewRoomService(repo admin.RoomRepository) RoomService {
	return &roomService{repo}
}

func (s *roomService) CreateRoom(name, description, roomNumber string, price float64, typeID string, capacity int, bedType, category string, facID, images []string) error {

    typeIDObj, err := primitive.ObjectIDFromHex(typeID)

	if err != nil {
		return errors.New("invalid room type ID")
	}

	facObjIDs := []primitive.ObjectID{}
	for _, id := range facID {
		oid, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			return errors.New("invalid facility ID: " + id)
		}
		facObjIDs = append(facObjIDs, oid)
	}

	room := models.Room{
		Id:            primitive.NewObjectID(),
		Name:          name,
		Description:   description,
		RoomNumber:    roomNumber,
		PricePerNight: price,
		RoomTypeID:    typeIDObj,
		FacilitiesID:  facObjIDs,
		Bed_type:      bedType,
		Category:      category,
		Images:        images,
		Capacity:      capacity,
		Availability:  true,
		CreatedAt:     primitive.NewDateTimeFromTime(time.Now()),
		UpdatedAt:     primitive.NewDateTimeFromTime(time.Now()),
	}
	
	return s.repo.Create(room)
}

func (s *roomService) UpdateRoom(id string, name, description, roomNumber string, price float64,
	typeID string, capacity int, bedType, category string, facIDs, images []string) error {

	room, err := s.repo.GetByID(id)
	if err != nil {
		return errors.New("room not found")
	}

	// convert RoomTypeID
	typeIDObj, err := primitive.ObjectIDFromHex(typeID)
	if err != nil {
		return errors.New("invalid room type ID")
	}

	// convert FacilitiesID
	facObjIDs := []primitive.ObjectID{}
	for _, fid := range facIDs {
		oid, err := primitive.ObjectIDFromHex(fid)
		if err != nil {
			return errors.New("invalid facility ID: " + fid)
		}
		facObjIDs = append(facObjIDs, oid)
	}

	room.Name = name
	room.Description = description
	room.RoomNumber = roomNumber
	room.PricePerNight = price
	room.RoomTypeID = typeIDObj
	room.Capacity = capacity
	room.Bed_type = bedType
	room.Category = category
	room.FacilitiesID = facObjIDs
	if len(images) > 0 {
		room.Images = images
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

func (s *roomService) GetByID(id string) (models.Room, error) {
	return s.repo.GetByID(id)
}
