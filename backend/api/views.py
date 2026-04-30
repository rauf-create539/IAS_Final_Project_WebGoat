from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .models import Note
from .serializer import NoteSerializer, UserSerializer

from rest_framework.permissions import IsAuthenticated, AllowAny

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = User
    permission_classes = [AllowAny]
