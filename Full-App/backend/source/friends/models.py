from django.db import models
from server.settings import AUTH_USER_MODEL

class REQUEST(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    sender = models.ForeignKey(AUTH_USER_MODEL, related_name='queryset_sender', on_delete=models.CASCADE)
    reciver = models.ForeignKey(AUTH_USER_MODEL, related_name='queryset_reciver', on_delete=models.CASCADE)

class FRIENDS(models.Model):
    account = models.ForeignKey(AUTH_USER_MODEL, related_name='queryset_account', on_delete=models.CASCADE)
    friends = models.ForeignKey(AUTH_USER_MODEL, related_name='queryset_friends', on_delete=models.CASCADE)

class BLOCKER(models.Model):
    blocker = models.ForeignKey(AUTH_USER_MODEL, related_name='queryset_blocker', on_delete=models.CASCADE, blank=True, null=True)
    blocked = models.ForeignKey(AUTH_USER_MODEL, related_name='queryset_blocked', on_delete=models.CASCADE, blank=True, null=True)
