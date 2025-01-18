from django.shortcuts import render
from rest_framework.decorators import api_view
from register.models import Register
from pingpong.models import Game
from django.db.models import Q
from pingpong.serializers import GameSerializer
from rest_framework.response import Response
from django.utils.timesince import timesince
from django.utils.timezone import now

@api_view(['GET'])
def match_history(request):
        user_id = request.query_params.get('user_id', None)
        if user_id is None:
            return Response({'error': '"user_id" param is required'}, status=400)
        user_id = int(user_id)
        try:
            user = Register.objects.get(id=user_id)
        except Register.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=400)
        games = Game.objects.filter(Q(winner=user) | Q(loser=user)).order_by('-end_time')
        if not games:
            return Response({'error': 'No games found'})
        serializer = GameSerializer(games, many=True)
        return Response(serializer.data)
