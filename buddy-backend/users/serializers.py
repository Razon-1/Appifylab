from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password', 'password_confirm')

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords don't match."})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Email already exists."})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        # Generate username from first_name and last_name
        first_name = validated_data.get('first_name', '').lower()
        last_name = validated_data.get('last_name', '').lower()
        username = f"{first_name}{last_name}" if first_name and last_name else validated_data['email'].split('@')[0]
        validated_data['username'] = username
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        # First find user by email
        try:
            user = User.objects.get(email=data['email'])
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")
        
        # Then check password
        if not user.check_password(data['password']):
            raise serializers.ValidationError("Invalid credentials")
        
        data['user'] = user
        return data

class AuthTokenSerializer(serializers.Serializer):
    token = serializers.CharField(read_only=True)
    user = UserSerializer(read_only=True)
    
    def to_representation(self, instance):
        from rest_framework.authtoken.models import Token
        user = instance.get('user')
        token, _ = Token.objects.get_or_create(user=user)
        return {
            'token': token.key,
            'user': UserSerializer(user).data
        }
