from rest_framework import serializers
from .models import Game

from rest_framework import serializers
from .models import Game
from register.serializers import RegisterSerializer

class GameSerializer(serializers.ModelSerializer):
    winner = RegisterSerializer()
    loser = RegisterSerializer()

    class Meta:
        model = Game
        fields = ['id', 'end_time', 'winner', 'loser', 'winner_score', 'loser_score']