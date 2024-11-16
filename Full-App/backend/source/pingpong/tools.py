from .models import PingPong
from register.models import Register
from asgiref.sync import sync_to_async


from asgiref.sync import sync_to_async
from django.utils import timezone

@sync_to_async
def on_save_match(winner, loser, score_winner, score_loser, LiveGameFlow, time_start):
    # Create the match and save goals as JSON
    time_end = timezone.now()
    print("[+] Match ended ", LiveGameFlow.goals)
    match = PingPong.objects.create( winner=winner, loser=loser, score_winner=score_winner, score_loser=score_loser, goals=LiveGameFlow.goals["goals"], time_start=time_start, time_end=time_end)