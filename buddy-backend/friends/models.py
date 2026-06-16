"""
FRIENDS APP MODELS
==================
Manages friend relationships and friend requests

MODELS:
1. FriendRequest - Handles friend request workflow (pending, accepted, rejected)
2. Friend - Represents confirmed friend relationships between users
"""
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class FriendRequest(models.Model):
    """
    Friend Request Model - Manages friend request lifecycle
    
    FEATURES:
    - Request workflow (pending → accepted/rejected)
    - Prevention of duplicate requests (unique together)
    - Timestamp tracking
    
    STATUS WORKFLOW:
    - pending: Awaiting receiver response
    - accepted: Receiver accepted, Friend record created
    - rejected: Receiver declined request
    
    FIELDS:
    - sender: User initiating the friend request
    - receiver: User receiving the friend request
    - status: Current status of the request
    - created_at: When request was created
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_requests')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_requests')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Prevent duplicate requests between same two users
        unique_together = ('sender', 'receiver')

    def __str__(self):
        return f"Friend request from {self.sender} to {self.receiver}"

class Friend(models.Model):
    """
    Friend Model - Represents confirmed friendships
    
    FEATURES:
    - Bidirectional friend relationships
    - Prevention of duplicate friendships (unique together)
    - Timestamp tracking
    
    NOTE:
    - Created when a FriendRequest is accepted
    - Stored in canonical form (user1 < user2 to avoid duplicates)
    
    FIELDS:
    - user1: First user in friendship (typically lower ID)
    - user2: Second user in friendship (typically higher ID)
    - created_at: When friendship was established
    """
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friendships_1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friendships_2')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Prevent duplicate friendships
        unique_together = ('user1', 'user2')

    def __str__(self):
        return f"Friends: {self.user1} and {self.user2}"
