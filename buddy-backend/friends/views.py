from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import FriendRequest, Friend
from .serializers import FriendRequestSerializer, FriendSerializer

class FriendRequestViewSet(viewsets.ModelViewSet):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def requests(self, request):
        friend_requests = FriendRequest.objects.filter(receiver=request.user, status='pending')
        serializer = FriendRequestSerializer(friend_requests, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def create_request(self, request):
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
        friend_request = self.get_object()
        if friend_request.receiver != request.user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        friend_request.status = 'rejected'
        friend_request.save()
        return Response({"message": "Friend request rejected"})

    @action(detail=False, methods=['get'])
    def list_friends(self, request):
        friends = Friend.objects.filter(user1=request.user) | Friend.objects.filter(user2=request.user)
        serializer = FriendSerializer(friends, many=True)
        return Response(serializer.data)
