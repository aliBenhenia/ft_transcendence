from django.urls import path

from .block import friend_block, friend_unblock
from .views import account_request, request_accept, request_decline, friend_remove
from .details import friend_status, search_query, query_friends, query_invitations

urlpatterns = [
    path('list/', query_friends),
    path('block/', friend_block),
    path('search/', search_query),
    path('status/', friend_status),
    path('delete/', friend_remove),
    path('accept/', request_accept),
    path('unblock/', friend_unblock),
    path('request/', account_request),
    path('decline/', request_decline),
    path('invitations/', query_invitations),
]