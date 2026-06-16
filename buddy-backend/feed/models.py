"""
FEED APP MODELS
===============
Handles posts, comments, and interactions on the social network

MODELS:
1. Post - User-created posts with content, images, and privacy settings
2. Comment - Comments and replies on posts with nested reply support
"""
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Post(models.Model):
    """
    Post Model - Core content unit for the social network
    
    Features:
    - Public/Private visibility control
    - Image attachments (up to 5MB)
    - Like/Unlike functionality
    - Comment support with nested replies
    
    Fields:
    - author: User who created the post
    - content: Text content of the post
    - image: Optional image attachment
    - privacy: Public or Private visibility
    - created_at: Post creation timestamp
    - updated_at: Last modification timestamp
    - likes: Many-to-many relationship with users who liked it
    """
    PRIVACY_CHOICES = [
        ('public', 'Public - Visible to everyone'),
        ('private', 'Private - Visible only to author'),
    ]
    
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    image = models.ImageField(upload_to='posts/', null=True, blank=True)
    privacy = models.CharField(max_length=10, choices=PRIVACY_CHOICES, default='public')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)

    class Meta:
        ordering = ['-created_at']  # Newest posts first

    def __str__(self):
        return f"Post by {self.author.username} ({self.privacy})"
    
    def get_likes_count(self):
        """Get total number of likes on this post"""
        return self.likes.count()
    
    def get_liked_by_users(self):
        """Get list of users who liked this post"""
        return self.likes.values('id', 'username', 'email', 'first_name', 'last_name')


class Comment(models.Model):
    """
    Comment Model - Comments and replies on posts
    
    Features:
    - Nested replies (a comment can reply to another comment)
    - Like/Unlike functionality
    - Associated with a specific post
    
    Fields:
    - post: The post this comment is attached to
    - author: User who posted the comment
    - content: Comment text
    - parent: Optional parent comment (for reply support)
    - likes: Many-to-many relationship with users who liked it
    - created_at: Comment creation timestamp
    - updated_at: Last modification timestamp
    """
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    likes = models.ManyToManyField(User, related_name='liked_comments', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']  # Oldest comments first

    def __str__(self):
        comment_type = 'Reply' if self.parent else 'Comment'
        return f"{comment_type} by {self.author.username} on Post {self.post.id}"
    
    def is_reply(self):
        """Check if this comment is a reply to another comment"""
        return self.parent is not None
    
    def get_likes_count(self):
        """Get total number of likes on this comment"""
        return self.likes.count()
    
    def get_liked_by_users(self):
        """Get list of users who liked this comment"""
        return self.likes.values('id', 'username', 'email', 'first_name', 'last_name')
