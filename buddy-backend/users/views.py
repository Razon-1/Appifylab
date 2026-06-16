"""
USERS APP VIEWS
===============
Handles user authentication, registration, and profile management

KEY FEATURES:
1. AuthViewSet - User authentication operations
   - register: Create new user account with email/username/password
   - login: Authenticate user and return profile + token
   - logout: End user session

2. UserViewSet - Profile management (if implemented)
   - get_profile: Fetch authenticated user's profile
   - update_profile: Update user profile info (bio, picture)
   - search_users: Find users by username or name
   - get_public_profile: View another user's public profile

SECURITY:
- Password hashing and validation
- Token-based authentication for API requests
- Email validation
- CSRF protection enabled
- Only authenticated users can access protected endpoints

API RESPONSE FORMAT:
All responses follow standard format:
{
  "success": true/false,
  "message": "descriptive message",
  "data": { ...response data... }
}
"""
import logging
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from buddy_script.response import APIResponse
from buddy_script.exceptions import ValidationError, AuthenticationFailed, ResourceNotFound
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, AuthTokenSerializer

logger = logging.getLogger(__name__)
User = get_user_model()


class AuthViewSet(viewsets.ViewSet):
    """
    Authentication endpoints for user registration and login
    
    Actions:
        - register: Create new user account
        - login: Authenticate user and return profile
        - logout: End user session
    """
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        """
        Register a new user account
        
        Request body:
            {
                "email": "user@example.com",
                "username": "username",
                "password": "password123",
                "password_confirm": "password123"
            }
        
        Returns:
            - success (201): User created with profile data
            - error (400): Validation errors
        """
        try:
            serializer = RegisterSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                logger.info(f"New user registered: {user.username}")
                token_data = AuthTokenSerializer({'user': user}).data
                return APIResponse.success(
                    data=token_data,
                    message="User registered successfully",
                    status_code=status.HTTP_201_CREATED
                )
            return APIResponse.error(
                message="Registration failed",
                data=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return APIResponse.error(
                message="An error occurred during registration",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def login(self, request):
        """
        Authenticate user and return profile
        
        Request body:
            {
                "email": "user@example.com",
                "password": "password123"
            }
        
        Returns:
            - success (200): User authenticated with profile
            - error (400): Invalid credentials
        """
        try:
            serializer = LoginSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.validated_data['user']
                logger.info(f"User logged in: {user.username}")
                token_data = AuthTokenSerializer({'user': user}).data
                return APIResponse.success(
                    data=token_data,
                    message="Login successful"
                )
            return APIResponse.error(
                message="Invalid email or password",
                data=serializer.errors,
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return APIResponse.error(
                message="An error occurred during login",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """
        End user session (typically handled by frontend token removal)
        
        Returns:
            - success (200): Logout confirmed
        """
        logger.info(f"User logged out: {request.user.username}")
        return APIResponse.success(message="Logout successful")


class UserViewSet(viewsets.ModelViewSet):
    """
    User profile management and search
    
    Actions:
        - list: Get all users (paginated)
        - retrieve: Get user profile by ID
        - profile: Get current user profile
        - search: Search users by username
        - update: Update user profile
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def profile(self, request):
        """
        Get current authenticated user's profile
        
        Returns:
            - success (200): Current user profile data
        """
        try:
            serializer = UserSerializer(request.user)
            return APIResponse.success(
                data=serializer.data,
                message="Profile retrieved successfully"
            )
        except Exception as e:
            logger.error(f"Profile retrieval error: {str(e)}")
            return APIResponse.error(
                message="Failed to retrieve profile",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Search users by username
        
        Query Parameters:
            - q: Search query string (required)
            - limit: Maximum results (default: 10)
        
        Returns:
            - success (200): List of matching users
            - error (400): Missing search query
        """
        try:
            query = request.query_params.get('q', '').strip()
            limit = int(request.query_params.get('limit', 10))
            
            if not query:
                return APIResponse.error(
                    message="Search query is required",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            users = User.objects.filter(
                username__icontains=query
            )[:limit]
            
            serializer = UserSerializer(users, many=True)
            return APIResponse.success(
                data=serializer.data,
                message=f"Found {users.count()} users"
            )
        except ValueError:
            return APIResponse.error(
                message="Invalid limit parameter",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Search error: {str(e)}")
            return APIResponse.error(
                message="Search failed",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
