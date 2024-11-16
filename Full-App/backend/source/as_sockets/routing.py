from django.urls import path
from pingpong.match import LiveGameFlow
from tournement.match import LiveTournement
from notification.socket import Notifications

websocket_urlpatterns = [
    path('ws/connection/', Notifications.as_asgi()),
    path('ws/tournement/', LiveTournement.as_asgi()),
    path('ws/pingpong/<str:username>/', LiveGameFlow.as_asgi()),
]