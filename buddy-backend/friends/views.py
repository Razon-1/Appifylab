"""
FRIENDS APP VIEWS
=================
Handles friend request workflow and friend list management

KEY FEATURES:
1. FriendRequestViewSet - Friend request management
   - requests: Get all pending friend requests for current user
   - create_request: Send friend request to another user
   - accept: Accept a pending friend request
   - reject: Decline a friend request
   - list_friends: Get all confirmed friends

WORKFLOW:
1. User A sends friend request to User B
   - FriendRequest created with status='pending'
   - Request waits for User B to respond
   
2. User B accepts request
   - FriendRequest status changed to 'accepted'
   - Friend record created linking both users
   
3. User B rejects request (optional)
   - FriendRequest status changed to 'rejected'
   - Friendship not created

SECURITY:
- All endpoints require authentication
- Users can only accept/reject their own requests
- Prevents sending request to self
- Prevents duplicate requests
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import FriendRequest, Friend
from .serializers import FriendRequestSerializer, FriendSerializer

class FriendRequestViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing friend requests and friendships
    
    ACTIONS:
    - requests: Get pending requests for current user
    - create_request: Send friend request to another user
    - accept: Accept pending request (detail endpoint)
    - reject: Reject pending request (detail endpoint)
    - list_friends: Get all confirmed friends
    """
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def requests(self, request):
        """Get all pending friend requests for the current user"""
        friend_requests = FriendRequest.objects.filter(receiver=request.user, status='pending')
        serializer = FriendRequestSerializer(friend_requests, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def create_request(self, request):
        """
        Send friend request to another user
        
        REQUEST BODY:
        {
            "receiver_id": <user_id>
        }
        
        VALIDATION:
        - Cannot send request to self
        - If request exists, returns existing request
        """
        receiver_id = request.data.get('receiver_id')
        if request.user.id == receiver_id:
            return Response({"error": "Cannot send request to yourself"}, status=status.HTTP_400_BAD_REQUEST)

        friend_request, created = FriendRequest.objects.get_or_create(
            sender=request.user,
            receiver_id=receiver_id
        )
        serializer = FriendRequestSerializer(friend_request)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """
        Accept friend request and create friendship
        
        WORKFLOW:
        1. Validate request is for current user (receiver)
        2. Update request status to 'accepted'
        3. Create Friend record linking both users
        """
        friend_request = self.get_object()
        if friend_request.receiver != request.user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        friend_request.status = 'accepted'
        friend_request.save()

        Friend.objects.get_or_create(
            user1=friend_request.sender,
            user2=friend_request.receiver
        )
        return Response({"message": "Friend request accepted"})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """
        Reject friend request
        
        VALIDATION:
        - Only receiver can reject their own request
        """
        friend_request = self.get_object()
        if friend_request.receiver != request.user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        friend_request.status = 'rejected'
        friend_request.save()
        return Response({"message": "Friend request rejected"})

    @action(detail=False, methods=['get'])
    def list_friends(self, request):
        """Get all confirmed friends for the current user"""
        friends = Friend.objects.filter(user1=request.user) | Friend.objects.filter(user2=request.user)
        serializer = FriendSerializer(friends, many=True)
        return Response(serializer.data)
