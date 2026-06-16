"""
FRIENDS APP - URL CONFIGURATION
===============================
Defines routes for friend management endpoints

ROUTES:
- /requests/                   - Get pending friend requests
- /create_request/             - Send new friend request
- /<id>/accept/                - Accept friend request
- /<id>/reject/                - Reject friend request
- /list_friends/               - Get all confirmed friends
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FriendRequestViewSet

# Create router and register viewsets
router = DefaultRouter()
router.register(r'', FriendRequestViewSet, basename='friends')

urlpatterns = [
    path('', include(router.urls)),
]
