package admin

import (
	"astro-backend/config"
	"astro-backend/models"
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	
)

type RoomRepository interface {
	Create(room models.Room) error
	Update(id string, room models.Room) error
	Delete(id string) error
	GetAll() ([]models.Room, error)
	GetByID(id string) (models.Room, error)
}

type roomRepository struct{}

func NewRoomRepository() RoomRepository {
	return &roomRepository{}
}

func (*roomRepository) Create(room models.Room) error {
	collection := config.GetMongoCollection("room")

	room.Id = primitive.NewObjectID()
	room.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	room.UpdatedAt = room.CreatedAt

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, room)
	return err
}

func (r *roomRepository) Update(id string, room models.Room) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	collection := config.GetMongoCollection("room")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = collection.UpdateOne(ctx,
		bson.M{"_id": objID},
		bson.M{"$set": room},
	)
	return err
}

func (*roomRepository) Delete(id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("ID tidak valid")
	}

	collection := config.GetMongoCollection("room")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = collection.DeleteOne(ctx, bson.M{"_id": objectID})
	return err
}

func (*roomRepository) GetAll() ([]models.Room, error) {
	collection := config.GetMongoCollection("room")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pipeline := mongo.Pipeline{
		{{Key: "$lookup", Value: bson.D{
			{Key: "from", Value: "roomType"},
			{Key: "localField", Value: "room_type_id"},
			{Key: "foreignField", Value: "_id"},
			{Key: "as", Value: "room_type"},
		}}},
		{{Key: "$lookup", Value: bson.D{
			{Key: "from", Value: "facilities"},
			{Key: "localField", Value: "facilities_id"},
			{Key: "foreignField", Value: "_id"},
			{Key: "as", Value: "facilities"},
		}}},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}

	var rooms []models.Room
	if err = cursor.All(ctx, &rooms); err != nil {
		return nil, err
	}

	return rooms, nil
}

func (*roomRepository) GetByID(id string) (models.Room, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return models.Room{}, errors.New("ID tidak valid")
	}

	collection := config.GetMongoCollection("room")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.D{{Key: "_id", Value: objectID}}}},
		{{Key: "$lookup", Value: bson.D{
			{Key: "from", Value: "roomType"},
			{Key: "localField", Value: "room_type_id"},
			{Key: "foreignField", Value: "_id"},
			{Key: "as", Value: "room_type"},
		}}},
		{{Key: "$lookup", Value: bson.D{
			{Key: "from", Value: "facilities"},
			{Key: "localField", Value: "facilities_id"},
			{Key: "foreignField", Value: "_id"},
			{Key: "as", Value: "facilities"},
		}}},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		return models.Room{}, err
	}

	var rooms []models.Room
	if err := cursor.All(ctx, &rooms); err != nil {
		return models.Room{}, err
	}

	if len(rooms) == 0 {
		return models.Room{}, errors.New("data tidak ditemukan")
	}

	return rooms[0], nil
}
