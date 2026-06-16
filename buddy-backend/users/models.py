"""
USERS APP MODELS
================
Handles user account management and profile data

MODEL:
- User - Extended Django user with social profile features
"""
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """
    Custom User Model extending Django's AbstractUser
    
    FEATURES:
    - User authentication (email, username, password)
    - Profile customization (bio, profile picture)
    - Social profile information
    - Timestamps for account tracking
    
    FIELDS:
    - bio: User's profile biography/about section
    - profile_picture: User's avatar image
    - created_at: Account creation timestamp
    - updated_at: Last profile update timestamp
    
    ADDITIONAL (from AbstractUser):
    - username, email, password (authentication)
    - first_name, last_name (profile info)
    - is_active, is_staff, is_superuser (permissions)
    """
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Fix reverse accessor clashes with default auth groups
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        related_name='custom_user_set'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        related_name='custom_user_set'
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.username
