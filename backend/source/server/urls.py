from django.urls import path, include

urlpatterns = [
    path('chat/', include('chat.urls')),
    path('login/', include('login.urls')),
    path('secure/', include('security.urls')),
    path('account/', include('account.urls')),
    path('friends/', include('friends.urls')),
    path('register/', include('register.urls')),
    path('pingpong/', include('pingpong.urls')),
    path('notification/', include('notification.urls')),
    
]


