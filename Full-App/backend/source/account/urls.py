from django.urls import path
from .views import account_view, searching_view, update_profile, activate_2FA

urlpatterns = [
   
    # ACCOUNT OPERATIONS
    path('2FA/', activate_2FA),
    path('profile/', account_view),
    path('search/', searching_view),
    path('update/', update_profile),
]