"""
Feed app serializers for posts and comments
"""
from rest_framework import serializers
from .models import Post, Comment
from users.serializers import UserSerializer


class LikeCountSerializer(serializers.Serializer):
    """Serializer for like information"""
    id = serializers.IntegerField()
    username = serializers.CharField()
    profile_picture = serializers.URLField(allow_null=True)


class CommentLikeSerializer(serializers.Serializer):
    """Serializer for comment/reply likes"""
    id = serializers.IntegerField()
    username = serializers.CharField()
    profile_picture = serializers.URLField(allow_null=True)


class CommentReplySerializer(serializers.ModelSerializer):
    """
    Serializer for comment replies (nested comments)
    """
    author = UserSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    liked_by_users = serializers.SerializerMethodField()
    is_reply = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = (
            'id', 'author', 'content', 'created_at', 'updated_at',
            'likes_count', 'is_liked', 'liked_by_users', 'is_reply'
        )

    def get_likes_count(self, obj):
        return obj.get_likes_count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    def get_liked_by_users(self, obj):
        """Get list of users who liked this comment"""
        users = obj.get_liked_by_users()
        return LikeCountSerializer(users, many=True).data

    def get_is_reply(self, obj):
        return obj.is_reply()


class CommentSerializer(serializers.ModelSerializer):
    """
    Serializer for comments with nested replies
    """
    author = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    liked_by_users = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = (
            'id', 'author', 'content', 'created_at', 'updated_at',
            'likes_count', 'is_liked', 'liked_by_users', 'replies'
        )

    def get_replies(self, obj):
        """Get all replies to this comment"""
        if obj.is_reply():
            return []  # Don't show nested replies (2 levels max)
        replies = obj.replies.all()
        return CommentReplySerializer(replies, many=True, context=self.context).data

    def get_likes_count(self, obj):
        return obj.get_likes_count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    def get_liked_by_users(self, obj):
        """Get list of users who liked this comment"""
        users = obj.get_liked_by_users()
        return LikeCountSerializer(users, many=True).data


class PostSerializer(serializers.ModelSerializer):
    """
    Serializer for posts with full details including comments and likes
    """
    author = UserSerializer(read_only=True)
    comments = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    liked_by_users = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    can_edit = serializers.SerializerMethodField()
    can_delete = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = (
            'id', 'author', 'content', 'image', 'privacy', 'created_at', 'updated_at',
            'comments', 'comments_count', 'likes_count', 'is_liked', 'liked_by_users',
            'can_edit', 'can_delete'
        )

    def get_comments(self, obj):
        """Get all comments for this post (only top-level, not replies)"""
        comments = obj.comments.filter(parent__isnull=True)
        return CommentSerializer(comments, many=True, context=self.context).data

    def get_comments_count(self, obj):
        """Get total count of comments (including replies)"""
        return obj.comments.count()

    def get_likes_count(self, obj):
        return obj.get_likes_count()

    def get_is_liked(self, obj):
        """Check if current user liked this post"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    def get_liked_by_users(self, obj):
        """Get list of users who liked this post"""
        users = obj.get_liked_by_users()
        return LikeCountSerializer(users, many=True).data

    def get_can_edit(self, obj):
        """Check if current user can edit this post"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.author.id == request.user.id
        return False

    def get_can_delete(self, obj):
        """Check if current user can delete this post"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.author.id == request.user.id
        return False


class PostCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating posts
    """
    class Meta:
        model = Post
        fields = ('content', 'image', 'privacy')

    def validate_content(self, value):
        """Validate post content"""
        if not value or not value.strip():
            raise serializers.ValidationError("Post content cannot be empty")
        if len(value) > 5000:
            raise serializers.ValidationError("Post content cannot exceed 5000 characters")
        return value


class CommentCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating comments and replies
    """
    class Meta:
        model = Comment
        fields = ('content', 'parent')

    def validate_content(self, value):
        """Validate comment content"""
        if not value or not value.strip():
            raise serializers.ValidationError("Comment content cannot be empty")
        if len(value) > 1000:
            raise serializers.ValidationError("Comment cannot exceed 1000 characters")
        return value
