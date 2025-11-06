package models

import(
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	Id       primitive.ObjectID 	`bson:"_id,omitempty" json:"id"`
	Name     string             	`bson:"Name" json:"Name"`
	Email    string             	`bson:"Email" json:"Email"`
	NoTlp    string             	`bson:"NoTlp" json:"NoTlp"`
	Password string          	    `bson:"Password" json:"Password"`
	Role     string             	`bson:"Role" json:"Role"`
	CreatedAt primitive.DateTime   `bson:"CreatedAt" json:"CreatedAt"`
	UpdatedAt primitive.DateTime   `bson:"UpdatedAt" json:"UpdatedAt"`
}