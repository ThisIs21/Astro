package utils

// TruncateString memotong string terlalu panjang agar aman disimpan di log.
func TruncateString(s string) string {
	const maxLength = 5000 // bebas, aman untuk payload log
	if len(s) <= maxLength {
		return s
	}
	return s[:maxLength] + "...(truncated)"
}
