package middleware

import (
	"bytes"
	"context"
	"io"
	"net/http"
	"time"

	"github.com/google/uuid"
	"astro-backend/models"
	"astro-backend/service/activityLog"
	"astro-backend/utils"
	"astro-backend/constants"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"github.com/rs/zerolog/log"
)

// responseRecorder wraps http.ResponseWriter to capture status and body.
type responseRecorder struct {
	http.ResponseWriter
	status int
	buf    *bytes.Buffer
}

func (r *responseRecorder) WriteHeader(status int) {
	r.status = status
	r.ResponseWriter.WriteHeader(status)
}

func (r *responseRecorder) Write(b []byte) (int, error) {
	// capture body up to some limit
	if r.buf.Len() < utils.MaxPayloadSize {
		_, _ = r.buf.Write(b)
	}
	return r.ResponseWriter.Write(b)
}

// ActivityLoggerMiddleware returns a middleware that captures request/response and logs activity asynchronously.
func ActivityLoggerMiddleware(svc activityLog.ActivityLogService) func(next http.Handler) http.Handler {
	if svc == nil {
		// defensive: if service not provided, return no-op middleware
		return func(next http.Handler) http.Handler {
			return next
		}
	}
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now().UTC()
			reqID := r.Header.Get("X-Request-Id")
			if reqID == "" {
				reqID = uuid.New().String()
			}

			// read request body (but do not consume it for handlers) - so we need to tee it
			var reqBodyCopy []byte
			if r.Body != nil {
				// read but restore
				bodyBytes, err := io.ReadAll(r.Body)
				if err == nil && len(bodyBytes) > 0 {
					reqBodyCopy = bodyBytes
				}
				r.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
			}

			rec := &responseRecorder{ResponseWriter: w, status: http.StatusOK, buf: bytes.NewBuffer(nil)}
			// call next
			next.ServeHTTP(rec, r)
			duration := time.Since(start)

			// Compose log entry
			al := models.ActivityLog{
				RequestID:  reqID,
				SessionID:  r.Header.Get("X-Session-Id"),
				Endpoint:   r.URL.Path,
				Method:     r.Method,
				IPAddress:  utils.ExtractIP(r),
				UserAgent:  r.UserAgent(),
				CreatedAt:  start,
				ResponseStatus: rec.status,
				Message:    "",
			}

			// Attempt to populate user info from context (if authentication middleware set them)
			if uid, ok := r.Context().Value("user_id").(primitive.ObjectID); ok {
				al.UserID = &uid
			}
			if email, ok := r.Context().Value("user_email").(string); ok {
				al.UserEmail = email
			}

			// If request body JSON, sanitize and include
			if len(reqBodyCopy) > 0 {
				al.RequestPayload = utils.SanitizeJSONBytes(reqBodyCopy)
			}
			// Capture response preview
			if rec.buf.Len() > 0 {
				al.ResponsePayload = utils.SanitizeJSONBytes(rec.buf.Bytes())
			}

			// Determine action type heuristically
			switch r.Method {
			case http.MethodPost:
				al.ActionType = constants.ActCreate
			case http.MethodPut, http.MethodPatch:
				al.ActionType = constants.ActUpdate
			case http.MethodDelete:
				al.ActionType = constants.ActDelete
			case http.MethodGet:
				al.ActionType = constants.ActRead
			default:
				al.ActionType = "OTHER"
			}
			// Special-case booking endpoints - you can adjust pattern matching to your routes
			if r.URL.Path == "/api/bookings" && r.Method == http.MethodPost {
				al.ActionType = constants.ActBooking
				al.Category = constants.CategoryCritical
			}

			// Set status text
			if rec.status >= 200 && rec.status < 400 {
				al.Status = constants.StatusSuccess
			} else {
				al.Status = constants.StatusFailed
			}
			// Add metadata about latency
			al.Metadata = primitive.M{
				"latency_ms": duration.Milliseconds(),
			}

			// Non-blocking log (best-effort). Log errors locally only.
			if err := svc.Log(context.Background(), al); err != nil {
				// don't fail request; just log locally
				log.Error().Err(err).Str("request_id", reqID).Msg("activity log failed")
			}
		})
	}
}
