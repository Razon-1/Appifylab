"""
FEED APP - URL CONFIGURATION
============================
Defines routes for posts and comments endpoints

ROUTES:
- /posts/                      - List posts, create post
- /posts/<id>/                - Get, update, delete post
- /posts/<id>/like/            - Like/unlike post
- /posts/<id>/liked_by/        - Get users who liked post
- /comments/                   - List comments, create comment/reply
- /comments/<id>/              - Get, update, delete comment
- /comments/<id>/like/         - Like/unlike comment
- /comments/<id>/liked_by/     - Get users who liked comment
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, CommentViewSet

# Create router and register viewsets
router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='posts')
router.register(r'comments', CommentViewSet, basename='comments')

urlpatterns = [
    path('', include(router.urls)),
]
