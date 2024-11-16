from django.urls import path
from .views import query_conversation, send_message, list_conversation

urlpatterns = [
    path('message/', send_message),
    path('conversation/', query_conversation),
    path('list-conversation/', list_conversation),
]