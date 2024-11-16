from django.db import models
from register.models import Register

class Rooms(models.Model):
    date_end = models.DateTimeField(auto_now_add=False, blank=True, null=True)
    date_start = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    player1 = models.ForeignKey(Register, related_name="pl1", null=True, blank=True, on_delete=models.SET_NULL)
    player2 = models.ForeignKey(Register, related_name="pl2", null=True, blank=True, on_delete=models.SET_NULL)

    structure = models.JSONField(null=True, blank=True)

class Competition(models.Model):
    date_end = models.DateTimeField(auto_now_add=False, blank=True, null=True)
    date_start = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    teams = models.BooleanField(default=False)
    friends = models.BooleanField(default=False)
    finished = models.BooleanField(default=False)

    smi1 = models.OneToOneField(Rooms, blank=True, null=True, related_name="smi1", on_delete=models.SET_NULL)
    smi2 = models.OneToOneField(Rooms, blank=True, null=True, related_name="smi2", on_delete=models.SET_NULL)

    final = models.OneToOneField(Rooms, blank=True, null=True, related_name="final", on_delete=models.SET_NULL)
