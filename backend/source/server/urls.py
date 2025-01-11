from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
<<<<<<< HEAD
    path('chat/', include('chat.urls')),
    path('login/', include('login.urls')),
    path('secure/', include('security.urls')),
    path('account/', include('account.urls')),
    path('friends/', include('friends.urls')),
    path('register/', include('register.urls')),
    path('pingpong/', include('pingpong.urls')),
    path('notification/', include('notification.urls')),
    
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
=======
    path('api/chat/', include('chat.urls')),
    path('api/login/', include('login.urls')),
    path('api/secure/', include('security.urls')),
    path('api/account/', include('account.urls')),
    path('api/friends/', include('friends.urls')),
    path('api/register/', include('register.urls')),
    path('api/pingpong/', include('pingpong.urls')),
    path('api/notification/', include('notification.urls')),
    
]
>>>>>>> origin/main
