from django.urls import path
from .views import RegisterAccount
from django.conf.urls.static import static
from server import settings

urlpatterns = [
    # REGISTER ACCOUNT URLS CONFIGURATIONS
    path('create-account/', RegisterAccount.as_view()),
]


