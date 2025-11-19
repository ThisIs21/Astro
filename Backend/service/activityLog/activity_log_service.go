package activityLog

import (
	"context"
	"time"

	"astro-backend/constants"
	"astro-backend/models"
	"astro-backend/repository/activityLog"
	"astro-backend/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	// "github.com/rs/zerolog/log"
)

type ActivityLogService interface {
	Log(ctx context.Context, in models.ActivityLog) error
	GetByID(ctx context.Context, id string) (models.ActivityLog, error)
	Search(ctx context.Context, filter map[string]any, sortBy string, sortOrder int, limit int64, skip int64) ([]models.ActivityLog, int64, error)
	SoftDeleteOlderThan(ctx context.Context, category string, cutoff time.Time, batchSize int64) (int64, error)
	PermanentDeleteSoftDeletedBefore(ctx context.Context, before time.Time, batchSize int64) (int64, error)
	Close() error
}

// -------------------------------------------------------------

type activityLogService struct {
	repo         activityLog.ActivityLogRepository
	buffer       chan models.ActivityLog
	batchSize    int
	flushTimeout time.Duration
	quit         chan struct{}
}

func NewActivityLogService(repo activityLog.ActivityLogRepository, batchSize int, flushTimeout time.Duration) ActivityLogService {
	s := &activityLogService{
		repo:         repo,
		buffer:       make(chan models.ActivityLog, batchSize*10),
		batchSize:    batchSize,
		flushTimeout: flushTimeout,
		quit:         make(chan struct{}),
	}
	go s.runBatchWorker()
	return s
}

// -------------------------------------------------------------
// MAIN LOGIC
// -------------------------------------------------------------

func (s *activityLogService) Log(ctx context.Context, in models.ActivityLog) error {
	// sanitize
	if in.RequestPayload != nil {
		in.RequestPayload = sanitizePrimitiveM(in.RequestPayload)
	}
	if in.ResponsePayload != nil {
		in.ResponsePayload = sanitizePrimitiveM(in.ResponsePayload)
	}
	if in.Before != nil {
		in.Before = sanitizePrimitiveM(in.Before)
	}
	if in.After != nil {
		in.After = sanitizePrimitiveM(in.After)
	}

	if in.Category == "" {
		in.Category = categorize(in)
	}

	if in.CreatedAt.IsZero() {
		in.CreatedAt = time.Now().UTC()
	}

	select {
	case s.buffer <- in:
		return nil
	default:
		ctx2, cancel := context.WithTimeout(ctx, 2*time.Second)
		defer cancel()
		return s.repo.InsertOne(ctx2, in)
	}
}

func (s *activityLogService) GetByID(ctx context.Context, id string) (models.ActivityLog, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *activityLogService) Search(ctx context.Context, filter map[string]any, sortBy string, sortOrder int, limit int64, skip int64) ([]models.ActivityLog, int64, error) {
	bFilter := mapToBSON(filter)
	var sort bson.D
	if sortBy != "" {
		dir := -1
		if sortOrder >= 0 {
			dir = 1
		}
		sort = bson.D{{Key: sortBy, Value: dir}}
	}
	return s.repo.Search(ctx, bFilter, sort, limit, skip)
}

// -------------------------------------------------------------
// CLEANUP
// -------------------------------------------------------------

func (s *activityLogService) SoftDeleteOlderThan(ctx context.Context, category string, cutoff time.Time, batchSize int64) (int64, error) {
	return s.repo.SoftDeleteOlderThan(ctx, category, cutoff, batchSize)
}

func (s *activityLogService) PermanentDeleteSoftDeletedBefore(ctx context.Context, before time.Time, batchSize int64) (int64, error) {
	return s.repo.PermanentDeleteSoftDeletedBefore(ctx, before, batchSize)
}

func (s *activityLogService) Close() error {
	close(s.quit)

	var remaining []models.ActivityLog
DrainLoop:
	for {
		select {
		case l := <-s.buffer:
			remaining = append(remaining, l)
			if len(remaining) >= s.batchSize {
				_ = s.repo.Insert(context.Background(), remaining)
				remaining = remaining[:0]
			}
		default:
			break DrainLoop
		}
	}

	if len(remaining) > 0 {
		_ = s.repo.Insert(context.Background(), remaining)
	}

	return s.repo.Close()
}

// -------------------------------------------------------------
// WORKER + HELPERS
// -------------------------------------------------------------

func (s *activityLogService) runBatchWorker() {
	ticker := time.NewTicker(s.flushTimeout)
	defer ticker.Stop()

	var batch []models.ActivityLog

	for {
		select {
		case <-s.quit:
			if len(batch) > 0 {
				_ = s.repo.Insert(context.Background(), batch)
			}
			return

		case l := <-s.buffer:
			batch = append(batch, l)
			if len(batch) >= s.batchSize {
				_ = s.repo.Insert(context.Background(), batch)
				batch = batch[:0]
			}

		case <-ticker.C:
			if len(batch) > 0 {
				_ = s.repo.Insert(context.Background(), batch)
				batch = batch[:0]
			}
		}
	}
}

func categorize(in models.ActivityLog) string {
	switch in.ActionType {
	case constants.ActBooking, constants.ActPayment, constants.ActRefund:
		return constants.CategoryCritical

	case constants.ActLogin:
		if in.Status == constants.StatusFailed {
			return constants.CategorySecurity
		}
		return constants.CategoryGeneral

	case constants.ActDelete:
		if in.Resource == "bookings" || in.Resource == "payments" {
			return constants.CategoryCritical
		}
		return constants.CategoryGeneral
	}

	if _, ok := in.Metadata["suspicious"]; ok {
		return constants.CategorySecurity
	}

	return constants.CategoryGeneral
}

func sanitizePrimitiveM(m primitive.M) primitive.M {
	out := primitive.M{}
	for k, v := range m {
		switch vv := v.(type) {
		case string:
			out[k] = utils.TruncateString(vv)
		case map[string]any:
			out[k] = utils.SanitizeMap(vv)
		default:
			out[k] = vv
		}
	}
	return out
}

func mapToBSON(m map[string]any) bson.M {
	out := bson.M{}
	for k, v := range m {
		out[k] = v
	}
	return out
}