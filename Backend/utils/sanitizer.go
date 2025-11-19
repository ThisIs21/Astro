package utils

import (
	"encoding/json"
	"strings"
)

// MaxPayloadSize to store in logs (avoid huge payloads)
const MaxPayloadSize = 4096 // bytes

// SensitiveKeys - keys to remove/mask from payload
var SensitiveKeys = []string{
	"password", "passwd", "token", "access_token", "refresh_token",
	"card_number", "card", "cvv", "credit_card", "ssn",
}

// SanitizeMap removes sensitive keys and truncates long strings.
func SanitizeMap(in map[string]any) map[string]any {
	out := make(map[string]any, len(in))

	for k, v := range in {
		lk := strings.ToLower(k)

		if isSensitiveKey(lk) {
			out[k] = "[REDACTED]"
			continue
		}

		switch vv := v.(type) {
		case map[string]any: // cukup satu case ini
			out[k] = SanitizeMap(vv)

		case string:
			out[k] = truncateString(vv)

		default:
			out[k] = vv
		}
	}

	return out
}

func isSensitiveKey(k string) bool {
	for _, s := range SensitiveKeys {
		if k == s || strings.Contains(k, s) {
			return true
		}
	}
	return false
}

func truncateString(s string) string {
	if len(s) > MaxPayloadSize {
		return s[:MaxPayloadSize] + "...[TRUNCATED]"
	}
	return s
}

// SanitizeJSONBytes takes raw JSON bytes and returns sanitized map (or empty).
func SanitizeJSONBytes(b []byte) map[string]any {
	var m map[string]any
	if err := json.Unmarshal(b, &m); err != nil {
		return map[string]any{"_raw": truncateString(string(b))}
	}
	return SanitizeMap(m)
}
