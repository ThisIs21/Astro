package constants

// Action types (standardized strings)
const (
	ActCreate  = "CREATE"
	ActRead    = "READ"
	ActUpdate  = "UPDATE"
	ActDelete  = "DELETE"
	ActLogin   = "LOGIN"
	ActLogout  = "LOGOUT"
	ActBooking = "BOOKING"
	ActPayment = "PAYMENT"
	ActRefund  = "REFUND"
	ActAdmin   = "ADMIN"
)

// Categories for retention
const (
	CategoryCritical = "CRITICAL" // 90 days
	CategorySecurity = "SECURITY" // 60 days
	CategoryGeneral  = "GENERAL"  // 30 days
)

// Status
const (
	StatusSuccess = "SUCCESS"
	StatusFailed  = "FAILED"
)