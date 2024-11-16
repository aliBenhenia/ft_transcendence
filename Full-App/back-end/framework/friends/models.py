from django.db import models
from server_api import settings

class FriendsRequest(models.Model):

    sender_account = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='user_a' ,on_delete=models.CASCADE, null=True)
    reciver_account = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='user_b', on_delete=models.CASCADE, null=True)

    sending_date = models.DateTimeField(auto_now_add=True)

class FriendsList(models.Model):
    friends = models.ManyToManyField(settings.AUTH_USER_MODEL)
    
    def list_friends(self, username, search_status):
        objects_list = self.friends.all()
        if search_status:
            for obj in objects_list:
                if obj.username == username:
                    return True
            return False
        else:
            return objects_list


    def add_friend(self, account):
        '''
        print('[informations] :')
        for u in self.friends.all():
            print('[#] : ', u.username)
        '''
    
        if account not in self.friends.all():
            self.friends.add(account)
            self.friends.save()

    def find_friend(self, account):
        return account in self.friends.all()

class Rooms(models.Model):
    user_a = models.TextField()
    user_b = models.TextField()

    room_token = models.TextField()

class Message(models.Model):
    sender_msg = models.ForeignKey(settings.AUTH_USER_MODEL , related_name='sender_ws', on_delete=models.CASCADE, null=True)
    reciver_msg = models.ForeignKey(settings.AUTH_USER_MODEL , related_name='reciver_ws', on_delete=models.CASCADE, null=True)

    Message = models.TextField()
    time = models.DateTimeField(auto_now_add=True)










