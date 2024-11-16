from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from .views import welcome, C_TokenObtainPairView, register, index, FindAccount, FindMe, AccountDetails
from .profile import UserProfileView, LogoutView, UpdatePassword, OTPView, OTP_Update, ProfileUpdate
from .oauth2 import oauth2_login
from .activate import ActivationLink
from django.conf.urls.static import static
from server_api import settings
from .account import ResetPassword, VerificationCode, ChangePassword


urlpatterns = [
    path('find-me/', FindMe),
    path('accounts/', include('allauth.urls')),
    path('thirdparty/42/', oauth2_login),
    path('find-account/<str:username>/', FindAccount),
    path('account-details/<str:username>/', AccountDetails),
    path('account-activate/<str:token>/', ActivationLink),

    path('rest-password/update/', ChangePassword),
    path('rest-password/send/<str:username>/', ResetPassword),
    path('rest-password/check/<str:username>/', VerificationCode),

    path('register/', register, name="register"),
    path('logout/', LogoutView.as_view(), name="logout"),
    path('password-reset/', UpdatePassword.as_view(), name="password-reset"),
    path('otp-verify/', OTPView.as_view(), name="otp-verify"),
    path('otp-update/', OTP_Update.as_view(), name="otp-update"),

    path('profile-update/', ProfileUpdate.as_view(), name="profile-update"),

    path('api/token/', C_TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/profile/', UserProfileView.as_view(), name='profile_page'),

    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)