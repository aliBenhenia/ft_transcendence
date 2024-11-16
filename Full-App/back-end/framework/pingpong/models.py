from django.db import models
from django.db.models import Q
from users.models import Register

class RoomManager(models.Manager):

    @staticmethod
    def is_player_token_exist(object1, object2):
        room = RoomTwoPlayer.objects.filter(
            Q(player_one=object1, player_two=object2) | 
            Q(player_one=object2, player_two=object1)
        ).first()
        return room.room_token if room else None


    

class RoomTwoPlayer(models.Model):

    player_one = models.ForeignKey(Register, related_name="player_one", on_delete=models.CASCADE)
    player_two = models.ForeignKey(Register, related_name="player_two", on_delete=models.CASCADE)
    
    objects = RoomManager()
    room_token = models.CharField(max_length=40, unique=True)















'''

1. self.filter(...)

When this method is inside a custom manager, self is the instance of that manager.
allowing it to operate on the RoomTwoPlayer model.

2. The filter():

method is used to retrieve records from the database that match the given conditions. 
It returns a QuerySet containing the objects that match the filter criteria.

models.Q: 

The Q object in Django allows you to construct complex queries using logical operations
(AND, OR, NOT) within a filter. This is particularly useful when you need to 
combine multiple conditions in a single query.

'''





