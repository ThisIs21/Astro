package admin

import(
	"astro-backend/models"
	"astro-backend/config"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type RoomTypeRepository interface {
    GetAll() ([]models.RoomType, error)
	Create(roomType models.RoomType) (models.RoomType, error)
	Update(id string, roomType models.RoomType) error
	Delete(id string) error
}
type roomTypeRepository struct{}

func NewRoomTypeRepository() RoomTypeRepository {
	return &roomTypeRepository{}
}

func (*roomTypeRepository) GetAll() ([]models.RoomType, error) {
	collection := config.GetMongoCollection("roomType")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}

	var roomType []models.RoomType
	if err := cursor.All(ctx, &roomType); err != nil {
		return nil, err
	}

	return roomType, nil
}
func (*roomTypeRepository) Create(roomType models.RoomType) (models.RoomType, error) {
    collection := config.GetMongoCollection("roomType")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, roomType)
	if err != nil {
		return models.RoomType{}, err
	}

	return roomType, nil
}
func (*roomTypeRepository) Update(id string, roomType models.RoomType) error {
	collection := config.GetMongoCollection("roomType")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	updateData := bson.M{
		"name":  roomType.Name,
		"description" : roomType.Description,
	}

	_, err = collection.UpdateOne(ctx, bson.M{"_id": objID}, bson.M{"$set": updateData})

	return err

}
func (*roomTypeRepository) Delete(id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil
	}

	collection := config.GetMongoCollection("roomType")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = collection.DeleteOne(ctx, bson.M{"_id": objectID})
	return err
}