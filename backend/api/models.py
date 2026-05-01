from django.db import models
from django.contrib.auth.models import User

class Note(models.Model):
    title = models.CharField(max_length=100, default="title")
    content = models.TextField(blank=True, null=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='note')

class WebGoatLesson(models.Model):
    name = models.CharField(max_length=200, default="WebGoatLesson")
    description = models.TextField(blank=True)
    lesson_path = models.CharField(max_length=500, blank=True, null=True)  # Path to the lesson in WebGoat
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    
class LessonCompletion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lesson_completions')
    lesson = models.ForeignKey(WebGoatLesson, on_delete=models.CASCADE, related_name='completions')
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # One record per user per lesson
        unique_together = ('user', 'lesson')

    def __str__(self):
        status = "completed" if self.completed else "pending"
        return f"{self.user.username} - {self.lesson.name} [{status}]"