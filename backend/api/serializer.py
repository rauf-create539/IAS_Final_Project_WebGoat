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
        fields = ['id', 'username', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
        
    def validate_username(self, value):
        return escape(value)
    
    def validated_password(self, value):
        validate_password(value)
        return value
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        try:
            data = super().validate(attrs)
        except Exception:
            raise AuthenticationFailed('Invalid credentials')
        return data
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
        
