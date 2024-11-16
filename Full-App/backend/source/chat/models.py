from django.db import models
from register.models import Register

class MESSAGES(models.Model):

    sender = models.ForeignKey(Register , related_name='sender_ws', on_delete=models.CASCADE, null=True)
    account = models.ForeignKey(Register , related_name='reciver_ws', on_delete=models.CASCADE, null=True)

    message = models.TextField(max_length=2000)
    time = models.DateTimeField(auto_now_add=True)