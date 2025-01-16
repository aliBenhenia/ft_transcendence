from django.urls import path
from .views import register_account, intra_register
from django.conf.urls.static import static
from server import settings

urlpatterns = [
    # REGISTER ACCOUNT URLS CONFIGURATIONS
    path('create-account/', register_account),
    path('intra-42/', intra_register),
]
