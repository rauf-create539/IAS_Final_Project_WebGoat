from django.contrib import admin
from .models import Note, WebGoatLesson, LessonCompletion

# Register your models here.
admin.site.register(Note)
admin.site.register(WebGoatLesson)
admin.site.register(LessonCompletion)