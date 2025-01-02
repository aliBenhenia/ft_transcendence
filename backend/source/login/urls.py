from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import TokenOnLoginPairView, on_callback, oauth2_login

urlpatterns = [
    # JWT URLS CONFIGURATIONS
    path('api/token/', TokenOnLoginPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),

    # 42 OAUTH
    path('api/oauth/login/', oauth2_login),
    path('api/oauth/callback/', on_callback),
]

