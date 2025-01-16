from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import TokenOnLoginPairView

urlpatterns = [
    # JWT URLS CONFIGURATIONS
    path('token/', TokenOnLoginPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
]