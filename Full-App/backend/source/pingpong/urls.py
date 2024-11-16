from django.urls import path
from .views import view_info, delete_info

urlpatterns = [
    path('match/', view_info),
    path('delete/', delete_info),
]