package utils

import (
	"net"
	"net/http"
	"strings"
)


func ExtractIP(r *http.Request) string {
	// Check X-Forwarded-For (may contain csv)
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		// xff may be "client, proxy1, proxy2"
		parts := strings.Split(xff, ",")
		for _, p := range parts {
			ip := strings.TrimSpace(p)
			if ip != "" && isValidIP(ip) {
				return ip
			}
		}
	}
	// X-Real-IP
	if xr := strings.TrimSpace(r.Header.Get("X-Real-Ip")); xr != "" && isValidIP(xr) {
		return xr
	}
	// Fallback: RemoteAddr (host:port)
	host, _, err := net.SplitHostPort(strings.TrimSpace(r.RemoteAddr))
	if err == nil && isValidIP(host) {
		return host
	}
	// last-ditch: return RemoteAddr raw
	return r.RemoteAddr
}

func isValidIP(ip string) bool {
	return net.ParseIP(ip) != nil
}