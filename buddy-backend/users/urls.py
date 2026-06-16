"""
USERS APP - URL CONFIGURATION
=============================
Defines routes for authentication endpoints

ROUTES:
- /register/                   - User registration
- /login/                      - User login
- /logout/                     - User logout
- /profile/                    - Get/update user profile
- /search/                     - Search for users
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, UserViewSet

# Create router and register viewsets
router = DefaultRouter()
router.register(r'', AuthViewSet, basename='auth')

urlpatterns = [
    path('', include(router.urls)),
]
