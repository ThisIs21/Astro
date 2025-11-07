package admin

import (
	"astro-backend/config"
	"astro-backend/models"
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type UserRepository interface {
	Create(user models.User) error
	Delete(id string) error
	Update(id string, user models.User) error
	FindByEmail(Email string) (models.User, error)
	GetAllUsers() ([]models.User, error)
}

type userRepository struct{}

func NewUserRepository() UserRepository {
	return &userRepository{}
}
func (*userRepository) GetAllUsers() ([]models.User, error) {
	collection := config.GetMongoCollection("user")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var allUser []models.User

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	if err = cursor.All(ctx, &allUser); err != nil {
		return nil, err
	}

	return allUser, nil
}
func (*userRepository) Create(user models.User) error {
	collection := config.GetMongoCollection("user")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, user)
	return err
}
func (r *userRepository) Delete(id string) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("ID tidak valid")
	}

	collection := config.GetMongoCollection("user")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		return err
	}

	if result.DeletedCount == 0 {
		return errors.New("User dengan ID tersebut tidak ditemukan")
	}

	return nil
}
func (r *userRepository) Update(id string, user models.User) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("ID tidak valid")
	}

	collection := config.GetMongoCollection("user")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	updateData := bson.M{
		"Name":  user.Name,
		"Email": user.Email,
		"NoTlp": user.NoTlp,
		"Role":  user.Role,
	}

	// Jika password ingin diubah, hash ulang
	if user.Password != "" {
		hashed, err := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
		if err != nil {
			return errors.New("gagal hash password")
		}
		updateData["Password"] = string(hashed)
	}

	result, err := collection.UpdateOne(ctx, bson.M{"_id": objID}, bson.M{"$set": updateData})
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		return errors.New("User dengan ID tersebut tidak ditemukan")
	}

	return nil
}
func (r *userRepository) FindByEmail(Email string) (models.User, error) {
	collection := config.GetMongoCollection("user")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	err := collection.FindOne(ctx, bson.M{"Email": Email}).Decode(&user)

	if err != nil {
		return user, errors.New("Email tidak ditemukan")
	}

	return user, nil
}
