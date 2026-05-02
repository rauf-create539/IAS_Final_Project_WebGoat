from django.shortcuts import render
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import generics, status 
from rest_framework.decorators import api_view, permission_classes
from .models import Note, WebGoatLesson, LessonCompletion
from rest_framework.views import APIView
from rest_framework.response import Response 
from .serializer import NoteSerializer, UserSerializer, CustomTokenObtainPairSerializer, WebGoatLessonSerializer, LessonCompletionSerializer

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, AllowAny

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    return Response({
        'username': request.user.username,
        'email': request.user.email,
    })

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer  
    
class NoteListCreate(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NoteSerializer

    def get_queryset(self):
        return Note.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class NoteDelete(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NoteSerializer

    def get_queryset(self):
        return Note.objects.filter(owner=self.request.user)
    

class AssignedLessonView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Pick the first active lesson (swap logic here when you add lesson selection)
        lesson = WebGoatLesson.objects.filter(is_active=True).first()

        if not lesson:
            return Response(
                {'detail': 'No lesson has been assigned yet.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get or create the user's completion record for this lesson
        completion, _ = LessonCompletion.objects.get_or_create(
            user=request.user,
            lesson=lesson
        )

        serializer = LessonCompletionSerializer(completion)
        return Response(serializer.data)
    
class MarkLessonCompleteView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, lesson_id):
        try:
            completion = LessonCompletion.objects.get(
                user=request.user,
                lesson_id=lesson_id
            )
        except LessonCompletion.DoesNotExist:
            return Response(
                {'detail': 'Lesson not assigned to you.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if completion.completed:
            return Response(
                {'detail': 'Lesson already marked as complete.'},
                status=status.HTTP_200_OK
            )

        completion.completed = True
        completion.completed_at = timezone.now()
        completion.save()

        serializer = LessonCompletionSerializer(completion)
        return Response(serializer.data, status=status.HTTP_200_OK)