from django.urls import path, re_path

from .views import friends_view, send_cancel, friend_notify, accept_cancel
from .chat import DefaultRooms, SendMessages, DisplayMessages

'''
conversations
'''

urlpatterns = [
    path('list/<str:key>/', friends_view, name='friends-view'),
    path('request/<str:username>/<str:sending>/', send_cancel, name='send-cancel'),
    path('new-request/<str:username>/<str:sending>/', accept_cancel, name='accept-cancel'),
    path('notify/', friend_notify, name='friends-notify'),

    path('chat/', DefaultRooms),
    path('chat/<str:username>/', DisplayMessages),
    path('chat/message/<str:username>/', SendMessages),
]

