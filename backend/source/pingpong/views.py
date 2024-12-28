from django.shortcuts import render
from rest_framework.decorators import api_view
from register.models import Register
from pingpong.models import Game
from django.db.models import Q
from pingpong.serializers import GameSerializer
from rest_framework.response import Response

# Create your views here.
@api_view(['GET'])
def player_stats(request):
    user_id = int(request.query_params.get('user_id'))
    user = Register.objects.get(id=user_id)
    total_wins = Game.objects.filter(winner=user).count()
    total_losses = Game.objects.filter(loser=user).count()
    last_game = Game.objects.filter(Q(winner=user) | Q(loser=user)).order_by('-end_time').first()
    last_game_status = None
    if last_game.winner == user:
        last_game_status = "WIN"
    else:
        last_game_status = "LOSS"
    return Response({
        "total_matches" : total_wins + total_losses,
        "total_wins" : total_wins,
        "total_losses" : total_losses,
        "last_game" : last_game_status
    })

@api_view(['GET'])
def match_history(request):
    user_id = int(request.query_params.get('user_id'))
    user = Register.objects.get(id=user_id)
    games = Game.objects.filter(Q(winner=user) | Q(loser=user)).order_by('-end_time')
    serializer = GameSerializer(games, many=True)
    return Response(serializer.data)

