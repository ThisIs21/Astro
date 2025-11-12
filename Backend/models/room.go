package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Room struct {
	Id             primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name           string             `bson:"name" json:"name"`
	Description    string             `bson:"description" json:"description"`
	RoomNumber     string             `bson:"room_number" json:"room_number"`
	PricePerNight  float64            `bson:"price_per_night" json:"price_per_night"`
	Images         []string           `bson:"images" json:"images"`
	Bed_type	   string             `bson:"bed_type" json:"bed_type"`
	Type           string             `bson:"type" json:"type"`
	Capacity       int                `bson:"capacity" json:"capacity"`
	Availability   bool               `bson:"availability" json:"availability"`
	Facilities     []string           `bson:"facilities" json:"facilities"`
	Category       string             `bson:"category" json:"category"`
	CreatedAt      primitive.DateTime `bson:"created_at,omitempty" json:"created_at,omitempty"`
	UpdatedAt      primitive.DateTime `bson:"updated_at,omitempty" json:"updated_at,omitempty"`
}
