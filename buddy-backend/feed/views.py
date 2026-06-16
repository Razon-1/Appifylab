"""
Feed views for posts and comments management
"""
import logging
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from buddy_script.response import APIResponse
from .models import Post, Comment
from .serializers import (
    PostSerializer, PostCreateSerializer, CommentSerializer, 
    CommentCreateSerializer, CommentReplySerializer
)

logger = logging.getLogger(__name__)


class PostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing posts
    
    Actions:
        - list: Get feed posts (public + user's private)
        - retrieve: Get post detail
        - create: Create new post
        - update: Update user's post
        - destroy: Delete user's post
        - like: Like/unlike post
        - liked_by: Get list of users who liked the post
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Get posts visible to the current user"""
        # Show all public posts + user's own posts
        return Post.objects.filter(
            Q(privacy='public') | Q(author=self.request.user)
        ).select_related('author').prefetch_related('likes', 'comments')
    
    def get_serializer_class(self):
        """Use create serializer for create/update, regular for others"""
        if self.action in ['create', 'partial_update', 'update']:
            return PostCreateSerializer
        return PostSerializer
    
    def get_serializer_context(self):
        """Add request to serializer context"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def perform_create(self, serializer):
        """Create post with current user as author"""
        try:
            serializer.save(author=self.request.user)
            logger.info(f"Post created by {self.request.user.username}")
        except Exception as e:
            logger.error(f"Error creating post: {str(e)}")
            raise
    
    def list(self, request, *args, **kwargs):
        """Get user's feed with posts (newest first)"""
        try:
            queryset = self.get_queryset().order_by('-created_at')
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = self.get_serializer(queryset, many=True)
            return APIResponse.success(
                data=serializer.data,
                message=f"Feed loaded with {len(queryset)} posts"
            )
        except Exception as e:
            logger.error(f"Error loading feed: {str(e)}")
            return APIResponse.error(
                message="Failed to load feed",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def retrieve(self, request, *args, **kwargs):
        """Get single post detail"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return APIResponse.success(
                data=serializer.data,
                message="Post retrieved successfully"
            )
        except Exception as e:
            logger.error(f"Error retrieving post: {str(e)}")
            return APIResponse.error(
                message="Failed to retrieve post",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def create(self, request, *args, **kwargs):
        """Create new post"""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            
            # Return full post details
            post = Post.objects.get(id=serializer.instance.id)
            full_serializer = PostSerializer(post, context=self.get_serializer_context())
            return APIResponse.success(
                data=full_serializer.data,
                message="Post created successfully",
                status_code=status.HTTP_201_CREATED
            )
        except Exception as e:
            logger.error(f"Error creating post: {str(e)}")
            return APIResponse.error(
                message=str(e),
                status_code=status.HTTP_400_BAD_REQUEST
            )
    
    def partial_update(self, request, *args, **kwargs):
        """Update post (only author can edit)"""
        try:
            post = self.get_object()
            if post.author.id != request.user.id:
                return APIResponse.error(
                    message="You can only edit your own posts",
                    status_code=status.HTTP_403_FORBIDDEN
                )
            
            serializer = self.get_serializer(post, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            
            full_serializer = PostSerializer(post, context=self.get_serializer_context())
            return APIResponse.success(
                data=full_serializer.data,
                message="Post updated successfully"
            )
        except Exception as e:
            logger.error(f"Error updating post: {str(e)}")
            return APIResponse.error(
                message=str(e),
                status_code=status.HTTP_400_BAD_REQUEST
            )
    
    def destroy(self, request, *args, **kwargs):
        """Delete post (only author can delete)"""
        try:
            post = self.get_object()
            if post.author.id != request.user.id:
                return APIResponse.error(
                    message="You can only delete your own posts",
                    status_code=status.HTTP_403_FORBIDDEN
                )
            
            self.perform_destroy(post)
            logger.info(f"Post {post.id} deleted by {request.user.username}")
            return APIResponse.success(message="Post deleted successfully")
        except Exception as e:
            logger.error(f"Error deleting post: {str(e)}")
            return APIResponse.error(
                message="Failed to delete post",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        """Like or unlike a post"""
        try:
            post = self.get_object()
            is_liked = post.likes.filter(id=request.user.id).exists()
            
            if is_liked:
                post.likes.remove(request.user)
                message = "Post unliked"
                logger.info(f"Post {post.id} unliked by {request.user.username}")
            else:
                post.likes.add(request.user)
                message = "Post liked"
                logger.info(f"Post {post.id} liked by {request.user.username}")
            
            return APIResponse.success(
                data={
                    'is_liked': not is_liked,
                    'likes_count': post.likes.count()
                },
                message=message
            )
        except Exception as e:
            logger.error(f"Error toggling like: {str(e)}")
            return APIResponse.error(
                message="Failed to update like status",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'])
    def liked_by(self, request, pk=None):
        """Get list of users who liked this post"""
        try:
            post = self.get_object()
            liked_users = post.likes.values('id', 'username', 'profile_picture')
            return APIResponse.success(
                data=list(liked_users),
                message=f"{post.likes.count()} users liked this post"
            )
        except Exception as e:
            logger.error(f"Error fetching likes list: {str(e)}")
            return APIResponse.error(
                message="Failed to fetch likes",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CommentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing comments and replies
    
    Actions:
        - list: Get comments for a post
        - create: Create comment or reply
        - destroy: Delete comment (only author)
        - like: Like/unlike comment
        - liked_by: Get users who liked comment
    """
    queryset = Comment.objects.select_related('author', 'post', 'parent').prefetch_related('likes')
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        """Use create serializer for create, regular for others"""
        if self.action == 'create':
            return CommentCreateSerializer
        return CommentSerializer
    
    def get_serializer_context(self):
        """Add request to context"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def list(self, request, *args, **kwargs):
        """Get comments for a specific post"""
        try:
            post_id = request.query_params.get('post')
            if not post_id:
                return APIResponse.error(
                    message="Post ID is required",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            # Get only top-level comments (not replies)
            comments = Comment.objects.filter(
                post_id=post_id,
                parent__isnull=True
            ).select_related('author').prefetch_related('likes', 'replies')
            
            serializer = self.get_serializer(comments, many=True)
            return APIResponse.success(
                data=serializer.data,
                message=f"Loaded {comments.count()} comments"
            )
        except Exception as e:
            logger.error(f"Error loading comments: {str(e)}")
            return APIResponse.error(
                message="Failed to load comments",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def create(self, request, *args, **kwargs):
        """Create comment or reply"""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            post_id = request.data.get('post')
            parent_id = request.data.get('parent')
            
            # Validate post exists
            try:
                post = Post.objects.get(id=post_id)
            except Post.DoesNotExist:
                return APIResponse.error(
                    message="Post not found",
                    status_code=status.HTTP_404_NOT_FOUND
                )
            
            # Validate parent comment exists if it's a reply
            if parent_id:
                try:
                    parent = Comment.objects.get(id=parent_id)
                    serializer.save(author=request.user, post=post, parent=parent)
                except Comment.DoesNotExist:
                    return APIResponse.error(
                        message="Parent comment not found",
                        status_code=status.HTTP_404_NOT_FOUND
                    )
            else:
                serializer.save(author=request.user, post=post)
            
            # Return full comment details
            comment = Comment.objects.get(id=serializer.instance.id)
            if parent_id:
                full_serializer = CommentReplySerializer(comment, context=self.get_serializer_context())
            else:
                full_serializer = CommentSerializer(comment, context=self.get_serializer_context())
            
            comment_type = "Reply" if parent_id else "Comment"
            logger.info(f"{comment_type} created by {request.user.username} on post {post_id}")
            
            return APIResponse.success(
                data=full_serializer.data,
                message=f"{comment_type} created successfully",
                status_code=status.HTTP_201_CREATED
            )
        except Exception as e:
            logger.error(f"Error creating comment: {str(e)}")
            return APIResponse.error(
                message=str(e),
                status_code=status.HTTP_400_BAD_REQUEST
            )
    
    def destroy(self, request, *args, **kwargs):
        """Delete comment (only author can delete)"""
        try:
            comment = self.get_object()
            if comment.author.id != request.user.id:
                return APIResponse.error(
                    message="You can only delete your own comments",
                    status_code=status.HTTP_403_FORBIDDEN
                )
            
            self.perform_destroy(comment)
            logger.info(f"Comment {comment.id} deleted by {request.user.username}")
            return APIResponse.success(message="Comment deleted successfully")
        except Exception as e:
            logger.error(f"Error deleting comment: {str(e)}")
            return APIResponse.error(
                message="Failed to delete comment",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        """Like or unlike a comment"""
        try:
            comment = self.get_object()
            is_liked = comment.likes.filter(id=request.user.id).exists()
            
            if is_liked:
                comment.likes.remove(request.user)
                message = "Comment unliked"
            else:
                comment.likes.add(request.user)
                message = "Comment liked"
            
            logger.info(f"Comment {comment.id} {message.split()[0].lower()} by {request.user.username}")
            
            return APIResponse.success(
                data={
                    'is_liked': not is_liked,
                    'likes_count': comment.likes.count()
                },
                message=message
            )
        except Exception as e:
            logger.error(f"Error toggling comment like: {str(e)}")
            return APIResponse.error(
                message="Failed to update like status",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'])
    def liked_by(self, request, pk=None):
        """Get users who liked this comment"""
        try:
            comment = self.get_object()
            liked_users = comment.likes.values('id', 'username', 'profile_picture')
            return APIResponse.success(
                data=list(liked_users),
                message=f"{comment.likes.count()} users liked this comment"
            )
        except Exception as e:
            logger.error(f"Error fetching comment likes: {str(e)}")
            return APIResponse.error(
                message="Failed to fetch likes",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
