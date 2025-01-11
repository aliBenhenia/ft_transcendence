from rest_framework import serializers
from .models import Game

from rest_framework import serializers
from .models import Game
from register.serializers import RegisterSerializer

class GameSerializer(serializers.ModelSerializer):
    winner = RegisterSerializer()
    loser = RegisterSerializer()
<<<<<<< HEAD

    class Meta:
        model = Game
        fields = ['id', 'end_time', 'time_ago', 'winner', 'loser', 'winner_score', 'loser_score']
=======
    # time_ago = 
    class Meta:
        model = Game
        fields = ['id', 'end_time', 'winner', 'loser', 'winner_score', 'loser_score']
>>>>>>> origin/main
