from django.urls import path
from .access import verify_2FA
from .password import find_account, request_password_reset, reset_password

urlpatterns = [

    # 2FA VERIFICATION
    path('verification/check/', verify_2FA),

    # REST PASSWORD VERIFICATION
    # path('reset-password/send/', send_code),
    # path('reset-password/verify/', verify_code),
    path('reset-password/locate/', find_account),
    # path('reset-password/update/<str:token>/', token_password),

    path('request-password-reset/', request_password_reset, name='request_password_reset'),
    path('reset-password/', reset_password),
]