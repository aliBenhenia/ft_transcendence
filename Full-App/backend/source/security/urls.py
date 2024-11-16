from django.urls import path
from .access import send_2FA, verify_2FA
from .password import send_code, verify_code, token_password, find_account

urlpatterns = [

    # 2FA VERIFICATION
    path('verification/send/', send_2FA),
    path('verification/check/', verify_2FA),

    # REST PASSWORD VERIFICATION
    path('reset-password/send/', send_code),
    path('reset-password/verify/', verify_code),
    path('reset-password/locate/', find_account),
    path('reset-password/update/<str:token>/', token_password),
]