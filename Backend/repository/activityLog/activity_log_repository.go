package activityLog

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"astro-backend/models"
)

// ActivityLogRepository mengelola operasi database untuk activity log
type ActivityLogRepository interface {
	// Existing methods
	Insert(ctx context.Context, log models.ActivityLog) error
	GetAll(ctx context.Context, limit int64, skip int64) ([]models.ActivityLog, error)
	Count(ctx context.Context) (int64, error)

	// Auto-deletion support
	DeleteOlderThan(ctx context.Context, beforeDate time.Time) (int64, error)
	DeleteByIDs(ctx context.Context, ids []primitive.ObjectID) (int64, error)

	// Query filtering untuk manual delete
	FindByDateRange(ctx context.Context, startDate, endDate time.Time, limit, skip int64) ([]models.ActivityLog, error)
	FindByUserID(ctx context.Context, userID primitive.ObjectID, limit, skip int64) ([]models.ActivityLog, error)
	FindByCriteria(ctx context.Context, filter bson.M, limit, skip int64) ([]models.ActivityLog, error)

	// Statistik
	CountByDateRange(ctx context.Context, startDate, endDate time.Time) (int64, error)
	GetOldestLog(ctx context.Context) (*models.ActivityLog, error)
	GetCollectionStats(ctx context.Context) (int64, error)
}