from django.urls import path
from .views import match_history
urlpatterns = [
    path('match_history/', match_history)
]