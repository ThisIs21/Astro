package admin

import (
	"astro-backend/models"
	"astro-backend/repository/admin"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)
	
type UserService interface {
	CreateUser(user models.User) error
	DeleteUser(id string) error
	UpdateUser(user models.User, id string) error
}

type userService struct {
	repo admin.UserRepository
}

func NewUserService(repo admin.UserRepository) UserService {
	return &userService{repo}
}

func (s *userService) CreateUser(user models.User) error {

	// Set ID + CreatedAt
	user.Id = primitive.NewObjectID()
	user.CreatedAt = primitive.NewDateTimeFromTime(time.Now())

	// Hash Password
	hashed, err := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
	if err != nil {
		return err
	}
	user.Password = string(hashed)

	// Save to DB via repository
	return s.repo.Create(user)
}
func (s *userService) DeleteUser(id string) error {
	if id == "" {
		return errors.New("ID tidak boleh kosong")
	}
	return s.repo.Delete(id)
}
func (s *userService) UpdateUser(user models.User, id string) error {
	return s.repo.Update(id, user)
}

