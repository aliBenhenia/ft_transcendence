from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import PingPong
from register.models import Register
import json

@api_view(['GET'])  
def view_info(request):
    ping = PingPong.objects.all()
    data = []
    for p in ping:
        info = {
            "winner" : p.winner.username, 
            "loser" : p.loser.username,
            "score_winner" : p.score_winner,
            "score_loser" : p.score_loser,
            "goals" : p.goals,
            "time_start" : p.time_start,
            "time_end" : p.time_end,
        }
        data.append(info)
    return Response(data)

@api_view(['GET'])  
def delete_info(request):
    obj = PingPong.objects.all()
    obj.delete()
    return Response({"message": "All data deleted."})