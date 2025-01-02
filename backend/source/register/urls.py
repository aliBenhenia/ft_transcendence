from django.urls import path
from .views import RegisterAccount
from django.conf.urls.static import static
from server import settings

urlpatterns = [
    # REGISTER ACCOUNT URLS CONFIGURATIONS
    path('create-account/', RegisterAccount.as_view()),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
