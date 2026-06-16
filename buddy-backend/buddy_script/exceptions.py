"""
Custom exceptions for the Buddy Script API
"""
from rest_framework.exceptions import APIException
from rest_framework import status


class BuddyScriptException(APIException):
    """Base exception for Buddy Script API"""
    default_detail = "An error occurred"
    default_code = "error"


class ValidationError(BuddyScriptException):
    """Raised when data validation fails"""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Validation error"
    default_code = "validation_error"


class AuthenticationFailed(BuddyScriptException):
    """Raised when authentication fails"""
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = "Authentication failed"
    default_code = "authentication_failed"


class PermissionDenied(BuddyScriptException):
    """Raised when user lacks required permissions"""
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = "Permission denied"
    default_code = "permission_denied"


class ResourceNotFound(BuddyScriptException):
    """Raised when requested resource is not found"""
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = "Resource not found"
    default_code = "not_found"


class ConflictError(BuddyScriptException):
    """Raised when there's a resource conflict"""
    status_code = status.HTTP_409_CONFLICT
    default_detail = "Conflict with existing resource"
    default_code = "conflict"


class RateLimitExceeded(BuddyScriptException):
    """Raised when rate limit is exceeded"""
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    default_detail = "Rate limit exceeded"
    default_code = "rate_limit_exceeded"
