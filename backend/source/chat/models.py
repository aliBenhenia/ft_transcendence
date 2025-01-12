from django.db import models
from register.models import Register
from django.utils import timezone

class MESSAGES(models.Model):

    sender = models.ForeignKey(Register , related_name='sender_ws', on_delete=models.CASCADE, null=True)
    account = models.ForeignKey(Register , related_name='reciver_ws', on_delete=models.CASCADE, null=True)

    message = models.TextField(max_length=2000)
    time = models.DateTimeField(auto_now_add=True)

class GameInvite(models.Model):
    room_name = models.CharField(max_length=10, default='null')
    inviter = models.ForeignKey(Register, on_delete=models.CASCADE, related_name='sent_invites')
    invited = models.ForeignKey(Register, on_delete=models.CASCADE, related_name='received_invites')
    status = models.CharField(max_length=10, default='null')
    created_at = models.DateTimeField(default=timezone.now)