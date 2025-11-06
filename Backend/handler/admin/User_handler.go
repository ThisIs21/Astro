package admin

import (
	"astro-backend/config"
	"astro-backend/models"
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

func IndexUser(c *gin.Context) {
	var userModels models.User

	c.JSON(http.StatusOK, gin.H{
		"message": "User handler is working!",
		"user":    userModels,
	})
}

func CreateUser(c *gin.Context) {
	var user models.User

	// Decode JSON request ke struct
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Buat ObjectID baru
	user.Id = primitive.NewObjectID()
	passwordJson := user.Password
	HashedPassword, err := bcrypt.GenerateFromPassword([]byte(passwordJson), 14)
	user.Password = string(HashedPassword)

	collection := config.GetMongoCollection("user")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = collection.InsertOne(ctx, user)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User created successfully",
		"user":    user,
	})
}
