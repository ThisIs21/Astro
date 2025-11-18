package scheduler

import (
	"context"
	"log"
	"os"
	"strconv"
	

	"github.com/robfig/cron/v3"

	// GUNAKAN RELATIVE PATH + NAMA PACKAGE YANG BENAR
	"astro-backend/models"                 // models → package models
	"astro-backend/service/activityLog"    // service/activityLog → package activityLog
)

// Pastikan nama struct dan field benar
type LogCleanupScheduler struct {
	service activityLog.ActivityLogService // ← activityLog.ActivityLogService
	cron    *cron.Cron
	config  models.CleanupConfig
	ctx     context.Context
	cancel  context.CancelFunc
}

func NewLogCleanupScheduler(service activityLog.ActivityLogService, config models.CleanupConfig) *LogCleanupScheduler {
	return &LogCleanupScheduler{
		service: service,
		cron:    cron.New(cron.WithSeconds()), // support detik
		config:  config,
	}
}

func (s *LogCleanupScheduler) Start(parentCtx context.Context) error {
	// FIX TYPO: s.ctx, bukan s c.tx atau s c.tx
	s.ctx, s.cancel = context.WithCancel(parentCtx)

	_, err := s.cron.AddFunc(s.config.Schedule, s.runCleanup)
	if err != nil {
		return err
	}

	s.cron.Start()
	log.Printf("[Scheduler] Log cleanup started → %s (retention: %d days)", s.config.Schedule, s.config.RetentionDays)
	<-s.ctx.Done()
	return nil
}

func (s *LogCleanupScheduler) Stop() {
	if s.cancel != nil {
		s.cancel()
	}
	if s.cron != nil {
		s.cron.Stop()
	}
	log.Println("[Scheduler] Log cleanup scheduler stopped")
}

func (s *LogCleanupScheduler) runCleanup() {
	log.Printf("[Cleanup] Running scheduled cleanup (keep last %d days)", s.config.RetentionDays)

	result, err := s.service.AutoCleanup(s.config.RetentionDays)
	if err != nil {
		log.Printf("[Cleanup] FAILED → %v", err)
		return
	}

	log.Printf("[Cleanup] SUCCESS → Deleted %d logs", result.DeletedCount)
}

// === ENV HELPER (bisa dipakai di main.go) ===
func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func getEnvAsInt(key string, fallback int) int {
	if v := os.Getenv(key); v != "" {
		if i, err := strconv.Atoi(v); err == nil {
			return i
		}
	}
	return fallback
}

func getEnvAsBool(key string, fallback bool) bool {
	if v := os.Getenv(key); v != "" {
		if b, err := strconv.ParseBool(v); err == nil {
			return b
		}
	}
	return fallback
}