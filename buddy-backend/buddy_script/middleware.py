"""
Custom middleware for the Buddy Script application
Handles logging, error handling, and request/response processing
"""
import logging
import json
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(MiddlewareMixin):
    """
    Middleware to log all HTTP requests and responses
    """
    
    def process_request(self, request):
        """Log incoming request details"""
        request._start_time = __import__('time').time()
        logger.info(f"[REQUEST] {request.method} {request.path}")
        return None

    def process_response(self, response):
        """Log response details"""
        if hasattr(response, '_start_time'):
            elapsed = __import__('time').time() - response._start_time
            logger.info(
                f"[RESPONSE] {response.status_code} {response.get('Content-Type', 'N/A')} "
                f"in {elapsed:.2f}s"
            )
        return response


class APIErrorHandlerMiddleware(MiddlewareMixin):
    """
    Middleware to handle API errors gracefully
    """
    
    def process_exception(self, request, exception):
        """Handle exceptions and return JSON error response"""
        logger.error(f"[ERROR] {str(exception)}", exc_info=True)
        
        # Only handle API requests
        if request.path.startswith('/api/'):
            return JsonResponse(
                {
                    'error': str(exception),
                    'success': False,
                    'message': 'An error occurred processing your request'
                },
                status=500
            )
        return None
