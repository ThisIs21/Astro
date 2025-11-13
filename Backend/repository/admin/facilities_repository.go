package admin

import (
	"astro-backend/config"
	"astro-backend/models"
	"context"
	"time"


	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type FacilityRepository interface {
	GetAll() ([]models.Facility, error)
	Create(facility models.Facility) (models.Facility, error)
	Update(id string, facility models.Facility) error
	Delete(id string) error
}

type facilityRepository struct{}

func NewFacilityRepository() FacilityRepository {
	return &facilityRepository{}
}

func (*facilityRepository) GetAll() ([]models.Facility, error) {
	collection := config.GetMongoCollection("facilities")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}

	var facilities []models.Facility
	if err := cursor.All(ctx, &facilities); err != nil {
		return nil, err
	}

	return facilities, nil
}
func (*facilityRepository) Create(facility models.Facility) (models.Facility, error) {
	collection := config.GetMongoCollection("facilities")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, facility)
	if err != nil {
		return models.Facility{}, err
	}

	return facility, nil
}
func (*facilityRepository) Update(id string, facility models.Facility) error {
	collection := config.GetMongoCollection("facilities")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	updateData := bson.M{
		"name":  facility.Name,
	}

	_, err = collection.UpdateOne(ctx, bson.M{"_id": objID}, bson.M{"$set": updateData})
	return err
}
func (*facilityRepository) Delete(id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil
	}

	collection := config.GetMongoCollection("facilities")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = collection.DeleteOne(ctx, bson.M{"_id": objectID})
	return err
}
