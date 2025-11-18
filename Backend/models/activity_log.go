package models

import (
	"time"
	"context"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"

) 

type ActivityLog struct {
	ID        primitive.ObjectID  `bson:"_id,omitempty" json:"id"`
	UserID    *primitive.ObjectID `bson:"user_id,omitempty" json:"user_id"` 
	SessionID string              `bson:"session_id" json:"session_id"`
	Action    string              `bson:"action" json:"action"`
	Endpoint  string              `bson:"endpoint" json:"endpoint"`
	Method    string              `bson:"method" json:"method"`
	IPAddress string              `bson:"ip_address" json:"ip_address"`
	UserAgent string              `bson:"user_agent" json:"user_agent"`
	Status    string              `bson:"status" json:"status"` // SUCCESS or FAILED
	Message   string              `bson:"message,omitempty" json:"message"`
	CreatedAt time.Time           `bson:"created_at" json:"created_at"`
}

type ActivityLogRepository interface {
    // Existing methods
    Insert(ctx context.Context, log ActivityLog) error
    GetAll(ctx context.Context, limit int64, skip int64) ([]ActivityLog, error)
    Count(ctx context.Context) (int64, error)

    // === NEW METHODS ===
    DeleteOlderThan(ctx context.Context, beforeDate time.Time) (int64, error)
    DeleteByIDs(ctx context.Context, ids []primitive.ObjectID) (int64, error)
    FindByDateRange(ctx context.Context, startDate, endDate time.Time, limit, skip int64) ([]ActivityLog, error)
    FindByUserID(ctx context.Context, userID primitive.ObjectID, limit, skip int64) ([]ActivityLog, error)
    FindByCriteria(ctx context.Context, filter bson.M, limit, skip int64) ([]ActivityLog, error)
    CountByDateRange(ctx context.Context, startDate, endDate time.Time) (int64, error)
    GetOldestLog(ctx context.Context) (*ActivityLog, error)
}

// === SERVICE INTERFACE ===
type ActivityLogService interface {
    WriteLog(userID *primitive.ObjectID, sessionID, action, endpoint, method, ip, agent, status, message string) error
    GetLogs(page, limit int64) ([]ActivityLog, int64, error)

    // === NEW METHODS ===
    AutoCleanup(retentionDays int) (CleanupResult, error)
    ScheduleCleanup(ctx context.Context, schedule string, retentionDays int) error
    DeleteLogsByDateRange(startDate, endDate time.Time, requestedBy primitive.ObjectID) (DeleteResult, error)
    DeleteLogsByIDs(ids []primitive.ObjectID, requestedBy primitive.ObjectID) (DeleteResult, error)
    DeleteLogsByUser(userID primitive.ObjectID, requestedBy primitive.ObjectID) (DeleteResult, error)
    GetLogsByCriteria(filter LogFilter, page, limit int64) ([]ActivityLog, int64, error)
    GetLogStats() (LogStatistics, error)
}

// === SUPPORTING STRUCTS ===
type CleanupResult struct {
    DeletedCount  int64
    ExecutedAt    time.Time
    RetentionDays int
    Error         error
}

type DeleteResult struct {
    DeletedCount int64
    DeletedBy    primitive.ObjectID
    DeletedAt    time.Time
    Criteria     string // deskripsi yang mudah dibaca
}

type LogFilter struct {
    StartDate *time.Time
    EndDate   *time.Time
    UserID    *primitive.ObjectID
    Action    *string
    Status    *string
    IPAddress *string
}

type LogStatistics struct {
    TotalLogs     int64
    OldestLogDate time.Time
    StorageSize   int64 // dalam bytes
    LogsPerDay    float64
}

type CleanupConfig struct {
    RetentionDays int
    Enabled       bool
    Schedule      string
}