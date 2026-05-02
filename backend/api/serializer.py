from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.utils.html import escape
from .models import Note, WebGoatLesson, LessonCompletion

class UserSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = User
        fields = ['id', 'username', 'email' ,'password']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
        }
        
    def validate_username(self, value):
        return escape(value)
    
    def validate_password(self, value):
        validate_password(value)
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use. Try another email.")
        return value
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            user = User.objects.get(email=email)     
        except User.DoesNotExist:
            raise AuthenticationFailed('No account found with this email.')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password.')

        if not user.is_active:
            raise AuthenticationFailed('This account is inactive.')

        refresh = self.get_token(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    
class NoteSerializer(serializers.ModelSerializer):  
    class Meta: 
        model=Note
        fields = ['id', 'description']
        
class WebGoatLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebGoatLesson
        fields = ['id', 'name', 'description', 'lesson_path']
        
class LessonCompletionSerializer(serializers.ModelSerializer):
    
    lesson = WebGoatLessonSerializer(read_only=True)
    
    class Meta:
        model = LessonCompletion
        fields = ['id', 'lesson', 'completed', 'completed_at', 'assigned_at']
        read_only_fields = ['id', 'lesson', 'completed_at', 'assigned_at']
        
