from django.db import models
from register.models import Register
from django.utils import timezone

class PingPong(models.Model):
    winner = models.ForeignKey(Register, related_name='query_winner', on_delete=models.CASCADE, null=True)
    loser = models.ForeignKey(Register, related_name='query_loser', on_delete=models.CASCADE, null=True)

    score_winner = models.IntegerField(default=0)
    score_loser = models.IntegerField(default=0)
    time_start = models.DateTimeField(null=True, blank=True)
    time_end = models.DateTimeField(null=True, blank=True)

    goals = models.JSONField(default=list)

    def __str__(self):
        return f"{self.winner} vs {self.loser}"