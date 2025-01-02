from django.urls import path
from .views import notification_view, notification_mark, notification_delete

urlpatterns = [
    path('api/view/', notification_view),
    path('api/mark/', notification_mark),
    path('api/delete/', notification_delete),
]