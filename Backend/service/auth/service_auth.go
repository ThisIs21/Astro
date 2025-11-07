package auth

import (
	"astro-backend/models"
	adminRepo "astro-backend/repository/admin" // alias agar tidak tabrakan
	"errors"

	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	Login(email, password string) (models.User, error)
}

type authService struct {
	repo adminRepo.UserRepository
}

func NewAuthService(repo adminRepo.UserRepository) AuthService {
	return &authService{repo}
}

func (s *authService) Login(Email, password string) (models.User, error) {
	user, err := s.repo.FindByEmail(Email)
	if err != nil {
		return user, errors.New("Email tidak ditemukan")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return user, errors.New("Password salah")
	}

	return user, nil
}
