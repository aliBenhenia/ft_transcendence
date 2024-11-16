from django.contrib import admin
from django.urls import path, include
from users.oauth2 import onCallBack

urlpatterns = [
    path('users/', include('users.urls')),
    path('friends/', include('friends.urls')),
    path('admin/', admin.site.urls),
    path('oauth/callback/', onCallBack)
]

