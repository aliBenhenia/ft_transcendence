from django.urls import path
from .views import match_history, player_stats
urlpatterns = [
    path('match_history/', match_history),
    path('player_stats/', player_stats)
]