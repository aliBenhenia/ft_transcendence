from django.db import models
from register.models import Register

# Create your models here.
class Game(models.Model):
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(auto_now_add=True, null=True)
    winner = models.ForeignKey(Register, on_delete=models.SET_NULL, null=True, related_name='games_won')
    loser = models.ForeignKey(Register, on_delete=models.SET_NULL, null=True, related_name='games_lost')
    score = models.JSONField(default=dict, null=True)