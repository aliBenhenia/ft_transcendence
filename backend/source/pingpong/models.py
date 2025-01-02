from django.db import models
from register.models import Register

# Create your models here.
class Game(models.Model):
    end_time = models.DateTimeField(auto_now_add=True, null=True)
    winner = models.ForeignKey(Register, on_delete=models.DO_NOTHING, null=True, related_name='games_won')
    loser = models.ForeignKey(Register, on_delete=models.DO_NOTHING, null=True, related_name='games_lost')
    winner_score = models.IntegerField(default=0, null=True)
    loser_score = models.IntegerField(default=0, null=True)