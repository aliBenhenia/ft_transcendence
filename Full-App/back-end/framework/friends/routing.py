from django.urls import path
from . import consumers
from pingpong import socket
from notifications.sockets import AccountWebSocket

websocket_urlpatterns = [
    path('friends/ws/notification/<str:username>/', consumers.ChatConsumerApp.as_asgi()),

    path('account/ws/open-connection/', AccountWebSocket.as_asgi()),

    path('pingpong/ws/match/open-connection/', socket.PlayerConsumerApp.as_asgi()),
    path('pingpong/ws/live/<str:username>/', socket.LiveGameFlow.as_asgi()),
]