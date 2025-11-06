package auth

import (
	"astro-backend/service/auth"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	service auth.AuthService
}

func NewAuthHandler(service auth.AuthService) *AuthHandler {
	return &AuthHandler{service}
}
func IndexAuth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "masukkan email dan password"})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var request struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	user, err := h.service.Login(request.Email, request.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login berhasil",
		"user":    user,
	})
}
