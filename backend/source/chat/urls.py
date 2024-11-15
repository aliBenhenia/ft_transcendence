from django.urls import path
from .views import query_conversation, send_message, list_conversation, fix_online

urlpatterns = [
    path('message/', send_message),
    path('conversation/', query_conversation),
    path('list-conversation/', list_conversation),
    path('fix/', fix_online),
]