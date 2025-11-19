package scheduler

import (
	"context"
	"time"
	"os"
	"strconv"

	"astro-backend/constants"
	"astro-backend/models"
	"astro-backend/service/activityLog"
	"github.com/rs/zerolog/log"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// CleanupJob performs retention-based cleanup.
// It will soft-delete older logs by category, then permanently delete those soft-deleted beyond grace period.
type CleanupJob struct {
	Svc         activityLog.ActivityLogService
	Interval    time.Duration
	GracePeriod time.Duration
	BatchSize   int64
	stop        chan struct{}
}

// NewCleanupJob reads config from env if values not provided.
func NewCleanupJob(svc activityLog.ActivityLogService) *CleanupJob {
	interval := parseDurationEnv("ACTIVITY_LOG_CLEANUP_INTERVAL", 24*time.Hour)
	grace := parseDurationEnv("ACTIVITY_LOG_CLEANUP_GRACE", 7*24*time.Hour) // default 7 days grace after soft-delete
	batch := int64(parseIntEnv("ACTIVITY_LOG_BATCH_SIZE", 1000))
	return &CleanupJob{
		Svc:         svc,
		Interval:    interval,
		GracePeriod: grace,
		BatchSize:   batch,
		stop:        make(chan struct{}),
	}
}

func (cj *CleanupJob) Start(ctx context.Context) {
	ticker := time.NewTicker(cj.Interval)
	defer ticker.Stop()
	log.Info().Dur("interval", cj.Interval).Msg("cleanup job started")
	// run once at startup
	cj.runOnce(ctx)
	for {
		select {
		case <-ticker.C:
			cj.runOnce(ctx)
		case <-cj.stop:
			log.Info().Msg("cleanup job stopped")
			return
		case <-ctx.Done():
			log.Info().Msg("cleanup job context cancelled")
			return
		}
	}
}

func (cj *CleanupJob) Stop() { close(cj.stop) }

func (cj *CleanupJob) runOnce(ctx context.Context) {
	now := time.Now().UTC()
	// read retention days from env, fallback to defaults
	criticalDays := parseIntEnv("ACTIVITY_LOG_RETENTION_CRITICAL", 90)
	securityDays := parseIntEnv("ACTIVITY_LOG_RETENTION_SECURITY", 60)
	generalDays := parseIntEnv("ACTIVITY_LOG_RETENTION_GENERAL", 30)

	// perform soft deletes per category
	stats := map[string]int64{}
	if n, err := cj.softDeleteCategory(ctx, constants.CategoryCritical, criticalDays); err == nil {
		stats[constants.CategoryCritical] = n
	} else {
		log.Error().Err(err).Str("category", constants.CategoryCritical).Msg("soft-delete failed")
	}
	if n, err := cj.softDeleteCategory(ctx, constants.CategorySecurity, securityDays); err == nil {
		stats[constants.CategorySecurity] = n
	} else {
		log.Error().Err(err).Str("category", constants.CategorySecurity).Msg("soft-delete failed")
	}
	if n, err := cj.softDeleteCategory(ctx, constants.CategoryGeneral, generalDays); err == nil {
		stats[constants.CategoryGeneral] = n
	} else {
		log.Error().Err(err).Str("category", constants.CategoryGeneral).Msg("soft-delete failed")
	}

	// permanent delete if deleted_at older than grace period
	cutoff := now.Add(-cj.GracePeriod)
	if n, err := cj.Svc.PermanentDeleteSoftDeletedBefore(ctx, cutoff, cj.BatchSize); err == nil {
		log.Info().Int64("permanently_deleted", n).Msg("cleanup permanent delete done")
	} else {
		log.Error().Err(err).Msg("permanent delete failed")
	}

	// log cleanup activity
	cleanupLog := models.ActivityLog{
		ActionType: constants.ActAdmin,
		Category:   constants.CategorySecurity,
		Endpoint:   "cleanup_job",
		Method:     "SYSTEM",
		Message:    "cleanup executed",
		Metadata:   primitive.M{"deleted_counts": stats},
		Status:     constants.StatusSuccess,
		CreatedAt:  now,
	}
	_ = cj.Svc.Log(context.Background(), cleanupLog)
}

// helper to compute cutoff and call repo
func (cj *CleanupJob) softDeleteCategory(ctx context.Context, category string, days int) (int64, error) {
	if days <= 0 {
		return 0, nil
	}
	cutoff := time.Now().UTC().AddDate(0, 0, -days)
	n, err := cj.Svc.SoftDeleteOlderThan(ctx, category, cutoff, cj.BatchSize)
	if err != nil {
		return 0, err
	}
	log.Info().Str("category", category).Int64("soft_deleted", n).Msg("soft-delete complete")
	return n, nil
}

/*** utils ***/
func parseDurationEnv(k string, def time.Duration) time.Duration {
	if v := os.Getenv(k); v != "" {
		if d, err := time.ParseDuration(v); err == nil { return d }
	}
	return def
}
func parseIntEnv(k string, def int) int {
	if v := os.Getenv(k); v != "" {
		if i, err := strconv.Atoi(v); err == nil { return i }
	}
	return def
}
func parseInt64Env(k string, def int64) int64 {
	if v := os.Getenv(k); v != "" {
		if i, err := strconv.ParseInt(v, 10, 64); err == nil { return i }
	}
	return def
}
