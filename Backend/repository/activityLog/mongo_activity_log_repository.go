package activityLog

import (
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"astro-backend/config"
	"astro-backend/models"
)

const (
	collectionName = "activity_log"
	batchSize      = 10000
)

type mongoActivityLogRepository struct {
	collection *mongo.Collection
}

func NewMongoActivityLogRepository() models.ActivityLogRepository {
	db := config.GetMongoDB()
	collection := db.Collection(collectionName)
	return &mongoActivityLogRepository{collection: collection}
}

// Insert
func (r *mongoActivityLogRepository) Insert(ctx context.Context, log models.ActivityLog) error {
	_, err := r.collection.InsertOne(ctx, log)
	return err
}

// GetAll
func (r *mongoActivityLogRepository) GetAll(ctx context.Context, limit int64, skip int64) ([]models.ActivityLog, error) {
	opts := options.Find().
		SetLimit(limit).
		SetSkip(skip).
		SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := r.collection.Find(ctx, bson.M{"deleted_at": nil}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var logs []models.ActivityLog
	return logs, cursor.All(ctx, &logs)
}

// Count
func (r *mongoActivityLogRepository) Count(ctx context.Context) (int64, error) {
	return r.collection.CountDocuments(ctx, bson.M{"deleted_at": nil})
}

// DeleteOlderThan - Soft delete logs older than beforeDate
func (r *mongoActivityLogRepository) DeleteOlderThan(ctx context.Context, beforeDate time.Time) (int64, error) {
	filter := bson.M{
		"created_at": bson.M{"$lt": beforeDate},
		"deleted_at": nil,
	}
	update := bson.M{"$set": bson.M{"deleted_at": time.Now()}}

	var totalDeleted int64
	for {
		result, err := r.collection.UpdateMany(ctx, filter, update) // filter dipakai!
		if err != nil {
			return totalDeleted, err
		}
		totalDeleted += result.ModifiedCount
		if result.ModifiedCount < batchSize {
			break
		}
	}
	return totalDeleted, nil
}

// DeleteByIDs - Soft delete by IDs
func (r *mongoActivityLogRepository) DeleteByIDs(ctx context.Context, ids []primitive.ObjectID) (int64, error) {
	if len(ids) == 0 {
		return 0, nil
	}

	update := bson.M{"$set": bson.M{"deleted_at": time.Now()}}
	var totalDeleted int64
	chunks := chunkIDs(ids, batchSize)

	for _, chunk := range chunks {
		filter := bson.M{"_id": bson.M{"$in": chunk}, "deleted_at": nil} // filter dipakai!
		result, err := r.collection.UpdateMany(ctx, filter, update)
		if err != nil {
			return totalDeleted, err
		}
		totalDeleted += result.ModifiedCount
	}
	return totalDeleted, nil
}

// FindByDateRange
func (r *mongoActivityLogRepository) FindByDateRange(ctx context.Context, startDate, endDate time.Time, limit, skip int64) ([]models.ActivityLog, error) {
	filter := bson.M{
		"created_at":  bson.M{"$gte": startDate, "$lte": endDate},
		"deleted_at": nil,
	} // filter dipakai!

	opts := options.Find().
		SetLimit(limit).
		SetSkip(skip).
		SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var logs []models.ActivityLog
	return logs, cursor.All(ctx, &logs)
}

// FindByUserID
func (r *mongoActivityLogRepository) FindByUserID(ctx context.Context, userID primitive.ObjectID, limit, skip int64) ([]models.ActivityLog, error) {
	filter := bson.M{"user_id": userID, "deleted_at": nil} // filter dipakai!

	opts := options.Find().
		SetLimit(limit).
		SetSkip(skip).
		SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var logs []models.ActivityLog
	return logs, cursor.All(ctx, &logs)
}

// FindByCriteria
func (r *mongoActivityLogRepository) FindByCriteria(ctx context.Context, filter bson.M, limit, skip int64) ([]models.ActivityLog, error) {
	filter["deleted_at"] = nil // filter dimodifikasi & dipakai!

	opts := options.Find().
		SetLimit(limit).
		SetSkip(skip).
		SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var logs []models.ActivityLog
	return logs, cursor.All(ctx, &logs)
}

// CountByDateRange
func (r *mongoActivityLogRepository) CountByDateRange(ctx context.Context, startDate, endDate time.Time) (int64, error) {
	filter := bson.M{
		"created_at":  bson.M{"$gte": startDate, "$lte": endDate},
		"deleted_at": nil,
	} // filter dipakai!

	return r.collection.CountDocuments(ctx, filter)
}

// GetOldestLog
func (r *mongoActivityLogRepository) GetOldestLog(ctx context.Context) (*models.ActivityLog, error) {
	opts := options.FindOne().SetSort(bson.D{{Key: "created_at", Value: 1}})
	var log models.ActivityLog
	err := r.collection.FindOne(ctx, bson.M{"deleted_at": nil}, opts).Decode(&log)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return &log, nil
}

// Helper: chunk IDs for batch deletion
func chunkIDs(ids []primitive.ObjectID, size int) [][]primitive.ObjectID {
	var chunks [][]primitive.ObjectID
	for i := 0; i < len(ids); i += size {
		end := i + size
		if end > len(ids) {
			end = len(ids)
		}
		chunks = append(chunks, ids[i:end])
	}
	return chunks
}