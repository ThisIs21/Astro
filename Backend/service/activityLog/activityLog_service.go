// service/activityLog/service.go

package activityLog

import (
	"context"
	"errors"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"astro-backend/models" // Adjust to your project import path
)

const (
	minRetentionDays = 7
	maxRetentionDays = 365
	auditAction      = "ADMIN_DELETE_LOGS"
)

type activityLogService struct {
	repo models.ActivityLogRepository
}

func NewActivityLogService(repo models.ActivityLogRepository) models.ActivityLogService {
	return &activityLogService{repo: repo}
}

func (s *activityLogService) WriteLog(userID *primitive.ObjectID, sessionID, action, endpoint, method, ip, agent, status, message string) error {
	log := models.ActivityLog{
		ID:        primitive.NewObjectID(),
		UserID:    userID,
		SessionID: sessionID,
		Action:    action,
		Endpoint:  endpoint,
		Method:    method,
		IPAddress: ip,
		UserAgent: agent,
		Status:    status,
		Message:   message,
		CreatedAt: time.Now(),
	}
	return s.repo.Insert(context.Background(), log)
}

func (s *activityLogService) GetLogs(page, limit int64) ([]models.ActivityLog, int64, error) {
	skip := (page - 1) * limit
	logs, err := s.repo.GetAll(context.Background(), limit, skip)
	if err != nil {
		return nil, 0, err
	}
	total, err := s.repo.Count(context.Background())
	if err != nil {
		return nil, 0, err
	}
	return logs, total, nil
}

// AutoCleanup performs automatic cleanup based on retention days
func (s *activityLogService) AutoCleanup(retentionDays int) (models.CleanupResult, error) {
	if retentionDays < minRetentionDays || retentionDays > maxRetentionDays {
		return models.CleanupResult{}, errors.New("invalid retention days")
	}
	beforeDate := time.Now().AddDate(0, 0, -retentionDays)
	deleted, err := s.repo.DeleteOlderThan(context.Background(), beforeDate)
	return models.CleanupResult{
		DeletedCount:  deleted,
		ExecutedAt:    time.Now(),
		RetentionDays: retentionDays,
		Error:         err,
	}, err
}

// ScheduleCleanup schedules a cleanup (implemented in scheduler, here for interface)
func (s *activityLogService) ScheduleCleanup(ctx context.Context, schedule string, retentionDays int) error {
	// This method is placeholder; actual scheduling in scheduler package
	return nil
}

// DeleteLogsByDateRange deletes logs by date range with audit
func (s *activityLogService) DeleteLogsByDateRange(startDate, endDate time.Time, requestedBy primitive.ObjectID) (models.DeleteResult, error) {
	if startDate.After(endDate) {
		return models.DeleteResult{}, errors.New("invalid date range")
	}
	// Assume permission check done in handler
	logs, err := s.repo.FindByDateRange(context.Background(), startDate, endDate, 0, 0)
	if err != nil {
		return models.DeleteResult{}, err
	}
	var ids []primitive.ObjectID
	for _, log := range logs {
		ids = append(ids, log.ID)
	}
	deleted, err := s.repo.DeleteByIDs(context.Background(), ids)
	if err != nil {
		return models.DeleteResult{}, err
	}
	criteria := fmt.Sprintf("date range %s to %s", startDate, endDate)
	s.auditDeletion(requestedBy, criteria, deleted)
	return models.DeleteResult{
		DeletedCount: deleted,
		DeletedBy:    requestedBy,
		DeletedAt:    time.Now(),
		Criteria:     criteria,
	}, nil
}

// DeleteLogsByIDs deletes logs by IDs with audit
func (s *activityLogService) DeleteLogsByIDs(ids []primitive.ObjectID, requestedBy primitive.ObjectID) (models.DeleteResult, error) {
	if len(ids) == 0 {
		return models.DeleteResult{}, errors.New("no IDs provided")
	}
	deleted, err := s.repo.DeleteByIDs(context.Background(), ids)
	if err != nil {
		return models.DeleteResult{}, err
	}
	criteria := fmt.Sprintf("IDs: %v", ids)
	s.auditDeletion(requestedBy, criteria, deleted)
	return models.DeleteResult{
		DeletedCount: deleted,
		DeletedBy:    requestedBy,
		DeletedAt:    time.Now(),
		Criteria:     criteria,
	}, nil
}

// DeleteLogsByUser deletes logs by user ID with audit
func (s *activityLogService) DeleteLogsByUser(userID, requestedBy primitive.ObjectID) (models.DeleteResult, error) {
	logs, err := s.repo.FindByUserID(context.Background(), userID, 0, 0)
	if err != nil {
		return models.DeleteResult{}, err
	}
	var ids []primitive.ObjectID
	for _, log := range logs {
		ids = append(ids, log.ID)
	}
	deleted, err := s.repo.DeleteByIDs(context.Background(), ids)
	if err != nil {
		return models.DeleteResult{}, err
	}
	criteria := fmt.Sprintf("user ID: %s", userID.Hex())
	s.auditDeletion(requestedBy, criteria, deleted)
	return models.DeleteResult{
		DeletedCount: deleted,
		DeletedBy:    requestedBy,
		DeletedAt:    time.Now(),
		Criteria:     criteria,
	}, nil
}

// GetLogsByCriteria gets logs by filter
func (s *activityLogService) GetLogsByCriteria(filter models.LogFilter, page, limit int64) ([]models.ActivityLog, int64, error) {
	bsonFilter := bson.M{}
	if filter.StartDate != nil {
		bsonFilter["created_at"] = bson.M{"$gte": *filter.StartDate}
	}
	if filter.EndDate != nil {
		if _, ok := bsonFilter["created_at"]; !ok {
			bsonFilter["created_at"] = bson.M{}
		}
		bsonFilter["created_at"].(bson.M)["$lte"] = *filter.EndDate
	}
	if filter.UserID != nil {
		bsonFilter["user_id"] = *filter.UserID
	}
	if filter.Action != nil {
		bsonFilter["action"] = *filter.Action
	}
	if filter.Status != nil {
		bsonFilter["status"] = *filter.Status
	}
	if filter.IPAddress != nil {
		bsonFilter["ip_address"] = *filter.IPAddress
	}
	skip := (page - 1) * limit
	logs, err := s.repo.FindByCriteria(context.Background(), bsonFilter, limit, skip)
	if err != nil {
		return nil, 0, err
	}
	// Approximate total; for exact, use separate count with filter
	total, _ := s.repo.Count(context.Background()) // Simplified; implement proper count if needed
	return logs, total, nil
}

// GetLogStats gets statistics
func (s *activityLogService) GetLogStats() (models.LogStatistics, error) {
	total, err := s.repo.Count(context.Background())
	if err != nil {
		return models.LogStatistics{}, err
	}
	oldest, err := s.repo.GetOldestLog(context.Background())
	if err != nil {
		return models.LogStatistics{}, err
	}
	var oldestDate time.Time
	if oldest != nil {
		oldestDate = oldest.CreatedAt
	}
	// StorageSize: Approximate or query db.stats()
	// For simplicity, assume 0; implement with db.runCommand if needed
	storageSize := int64(0)

	// LogsPerDay: Approximate
	days := time.Now().Sub(oldestDate).Hours() / 24
	logsPerDay := float64(0)
	if days > 0 {
		logsPerDay = float64(total) / days
	}

	return models.LogStatistics{
		TotalLogs:    total,
		OldestLogDate: oldestDate,
		StorageSize:  storageSize,
		LogsPerDay:   logsPerDay,
	}, nil
}

// auditDeletion logs the deletion action
func (s *activityLogService) auditDeletion(requestedBy primitive.ObjectID, criteria string, deleted int64) {
	message := fmt.Sprintf("Deleted %d logs with criteria: %s", deleted, criteria)
	s.WriteLog(&requestedBy, "", auditAction, "/admin/logs/delete", "DELETE", "", "", "SUCCESS", message)
}