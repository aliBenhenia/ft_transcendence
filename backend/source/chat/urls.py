from django.urls import path
from .views import  send_message, send_game_invite, accept_game_invite , reject_game_invite, query_conversation

urlpatterns = [
    path('message/', send_message),
    path('conversation/', query_conversation),
    # path('list-conversation/', list_conversation),
    # path('fix/', fix_online),
    path('send_game_invite/', send_game_invite),
    path('accept_game_invite/', accept_game_invite),
    path('reject_game_invite/', reject_game_invite)
]