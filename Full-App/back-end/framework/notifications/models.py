from django.db import models
from server_api import settings
from django.utils import timezone

class Notification(models.Model):
    
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='send_notifications', on_delete=models.CASCADE)
    account = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='recive_notifications', on_delete=models.CASCADE)

    
    message = models.BooleanField(default=False)
    invitation = models.BooleanField(default=False)
    #mark_as_read = models.BooleanField(default=False)
    time = models.DateTimeField(null=True, blank=True, default=timezone.now)
