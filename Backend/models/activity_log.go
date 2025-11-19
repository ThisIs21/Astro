package models

import (
	"time"
    
    "go.mongodb.org/mongo-driver/bson/primitive"

) 

type ActivityLog struct {
	ID             primitive.ObjectID  `bson:"_id,omitempty" json:"id"`
	UserID         *primitive.ObjectID `bson:"user_id,omitempty" json:"user_id,omitempty"` // nullable untuk guest
	UserEmail      string              `bson:"user_email,omitempty" json:"user_email,omitempty"`
	SessionID      string              `bson:"session_id,omitempty" json:"session_id,omitempty"` // jika ada
	RequestID      string              `bson:"request_id,omitempty" json:"request_id,omitempty"` // trace id
	ActionType     string              `bson:"action_type" json:"action_type"`                   // CREATE, UPDATE, DELETE, LOGIN, BOOKING, PAYMENT...
	Category       string              `bson:"category" json:"category"`                         // CRITICAL / SECURITY / GENERAL
	Endpoint       string              `bson:"endpoint" json:"endpoint"`
	Method         string              `bson:"method" json:"method"`
	IPAddress      string              `bson:"ip_address" json:"ip_address"`
	UserAgent      string              `bson:"user_agent,omitempty" json:"user_agent,omitempty"`
	Resource       string              `bson:"resource,omitempty" json:"resource,omitempty"`         // e.g. "bookings"
	ResourceID     string              `bson:"resource_id,omitempty" json:"resource_id,omitempty"`   // affected document id
	RequestPayload primitive.M         `bson:"request_payload,omitempty" json:"request_payload,omitempty"`   // sanitized
	ResponsePayload primitive.M        `bson:"response_payload,omitempty" json:"response_payload,omitempty"` // sanitized
	ResponseStatus  int                `bson:"response_status,omitempty" json:"response_status,omitempty"`   // HTTP status code
	Before          primitive.M        `bson:"before,omitempty" json:"before,omitempty"`                   // for updates
	After           primitive.M        `bson:"after,omitempty" json:"after,omitempty"`                     // for updates
	Priority        int                `bson:"priority,omitempty" json:"priority,omitempty"`               // optional
	Message         string             `bson:"message,omitempty" json:"message,omitempty"`
	Metadata        primitive.M        `bson:"metadata,omitempty" json:"metadata,omitempty"` // extensible map
	Status          string             `bson:"status" json:"status"`                         // "SUCCESS" or "FAILED"
	CreatedAt       time.Time          `bson:"created_at" json:"created_at"`
	DeletedAt       *time.Time         `bson:"deleted_at,omitempty" json:"deleted_at,omitempty"`
}