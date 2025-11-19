package activityLog

import (
	"context"
	"errors"
	"time"

	"astro-backend/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// ActivityLogRepository defines DB operations.
type ActivityLogRepository interface {
	Insert(ctx context.Context, logs []models.ActivityLog) error
	InsertOne(ctx context.Context, log models.ActivityLog) error
	FindByID(ctx context.Context, id string) (models.ActivityLog, error)
	Search(ctx context.Context, filter bson.M, sort bson.D, limit int64, skip int64) ([]models.ActivityLog, int64, error)
	SoftDeleteOlderThan(ctx context.Context, category string, cutoff time.Time, batchSize int64) (int64, error)
	PermanentDeleteSoftDeletedBefore(ctx context.Context, before time.Time, batchSize int64) (int64, error)
	Close() error
}

type activityLogRepo struct {
	col *mongo.Collection
	db  *mongo.Database
}

func NewActivityLogRepository(db *mongo.Database, collectionName string) ActivityLogRepository {
	return &activityLogRepo{
		col: db.Collection(collectionName),
		db:  db,
	}
}


func (r *activityLogRepo) Insert(ctx context.Context, logs []models.ActivityLog) error {
	if len(logs) == 0 {
		return nil
	}

	docs := make([]interface{}, 0, len(logs))
	for i := range logs {
		if logs[i].CreatedAt.IsZero() {
			logs[i].CreatedAt = time.Now().UTC()
		}
		docs = append(docs, logs[i])
	}

	_, err := r.col.InsertMany(ctx, docs, &options.InsertManyOptions{
		Ordered: boolPtr(false),
	})
	return err
}

func (r *activityLogRepo) InsertOne(ctx context.Context, log models.ActivityLog) error {
	if log.CreatedAt.IsZero() {
		log.CreatedAt = time.Now().UTC()
	}
	_, err := r.col.InsertOne(ctx, log)
	return err
}

func (r *activityLogRepo) FindByID(ctx context.Context, id string) (models.ActivityLog, error) {
	var res models.ActivityLog

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return res, err
	}

	err = r.col.FindOne(ctx, bson.M{"_id": objID}).Decode(&res)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return res, mongo.ErrNoDocuments
		}
		return res, err
	}

	return res, nil
}

func (r *activityLogRepo) Search(ctx context.Context, filter bson.M, sort bson.D, limit int64, skip int64) ([]models.ActivityLog, int64, error) {
	opts := options.Find()
	if sort != nil {
		opts.SetSort(sort)
	}
	if limit > 0 {
		opts.SetLimit(limit)
	}
	if skip > 0 {
		opts.SetSkip(skip)
	}

	cur, err := r.col.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cur.Close(ctx)

	var out []models.ActivityLog
	for cur.Next(ctx) {
		var doc models.ActivityLog
		if err := cur.Decode(&doc); err != nil {
			return nil, 0, err
		}
		out = append(out, doc)
	}

	count, err := r.col.CountDocuments(ctx, filter)
	if err != nil {
		return out, int64(len(out)), err
	}

	return out, count, nil
}

func (r *activityLogRepo) SoftDeleteOlderThan(ctx context.Context, category string, cutoff time.Time, batchSize int64) (int64, error) {
	filter := bson.M{
		"category":   category,
		"created_at": bson.M{"$lt": cutoff},
		"deleted_at": bson.M{"$exists": false},
	}
	update := bson.M{"$set": bson.M{"deleted_at": time.Now().UTC()}}

	res, err := r.col.UpdateMany(ctx, filter, update)
	if err != nil {
		return 0, err
	}

	return res.ModifiedCount, nil
}

func (r *activityLogRepo) PermanentDeleteSoftDeletedBefore(ctx context.Context, before time.Time, batchSize int64) (int64, error) {
	filter := bson.M{
		"deleted_at": bson.M{"$lt": before},
	}

	cur, err := r.col.Find(ctx, filter, &options.FindOptions{
		Projection: bson.M{"_id": 1},
		Limit:      &batchSize,
	})
	if err != nil {
		return 0, err
	}
	defer cur.Close(ctx)

	var ids []primitive.ObjectID
	for cur.Next(ctx) {
		var doc struct{ ID primitive.ObjectID `bson:"_id"` }
		if err := cur.Decode(&doc); err != nil {
			return 0, err
		}
		ids = append(ids, doc.ID)
	}

	if len(ids) == 0 {
		return 0, nil
	}

	delRes, err := r.col.DeleteMany(ctx, bson.M{"_id": bson.M{"$in": ids}})
	if err != nil {
		return 0, err
	}

	return delRes.DeletedCount, nil
}

func (r *activityLogRepo) Close() error {
	return nil
}

// HELPERS


func boolPtr(b bool) *bool { return &b }