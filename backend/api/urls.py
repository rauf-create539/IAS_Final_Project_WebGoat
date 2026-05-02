from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("lesson/", views.AssignedLessonView.as_view(), name="assigned_lesson"),
    path("lesson/<int:lesson_id>/complete/", views.MarkLessonCompleteView.as_view(), name="complete-lesson"),
    path("user/", views.current_user, name='current_user'),
]