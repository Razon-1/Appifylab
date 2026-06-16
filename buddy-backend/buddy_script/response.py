"""
Response formatter utility for consistent API responses
"""
from rest_framework.response import Response
from rest_framework import status


class APIResponse:
    """
    Standardized API response formatter
    
    Usage:
        return APIResponse.success(data={"user": user_data}, message="User created")
        return APIResponse.error("Invalid input", status=status.HTTP_400_BAD_REQUEST)
    """
    
    @staticmethod
    def success(data=None, message="Success", status_code=status.HTTP_200_OK):
        """
        Return a successful API response
        
        Args:
            data: Response data
            message: Success message
            status_code: HTTP status code (default: 200)
            
        Returns:
            Response object with success format
        """
        return Response(
            {
                'success': True,
                'message': message,
                'data': data,
            },
            status=status_code
        )
    
    @staticmethod
    def error(message, data=None, status_code=status.HTTP_400_BAD_REQUEST):
        """
        Return an error API response
        
        Args:
            message: Error message
            data: Error details (optional)
            status_code: HTTP status code (default: 400)
            
        Returns:
            Response object with error format
        """
        return Response(
            {
                'success': False,
                'message': message,
                'error': data,
            },
            status=status_code
        )
    
    @staticmethod
    def paginated(items, count, page_size, message="Success"):
        """
        Return a paginated response
        
        Args:
            items: List of items
            count: Total count
            page_size: Items per page
            message: Success message
            
        Returns:
            Response object with pagination metadata
        """
        return Response(
            {
                'success': True,
                'message': message,
                'data': items,
                'pagination': {
                    'total': count,
                    'page_size': page_size,
                    'total_pages': (count + page_size - 1) // page_size,
                }
            },
            status=status.HTTP_200_OK
        )
