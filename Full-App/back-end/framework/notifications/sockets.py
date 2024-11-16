from channels.generic.websocket import AsyncWebsocketConsumer
from friends.consumers import extract_auth_user, Register
from asgiref.sync import sync_to_async
from friends.consumers import get_recipient, get_profile
from .models import Notification
from datetime import datetime
import json


blue = "\033[94m"
red = "\033[91m"
reset = "\033[0m"

class AccountWebSocket(AsyncWebsocketConsumer):

    async def connect(self):
    
        token = self.scope['query_string'].decode().split('=')[1]
        self.user, is_authenticated = await extract_auth_user(token)
        if not is_authenticated:
            return await self.close()

        self.profile = await get_profile(self.user)
        await self.apply_changes(True, self.user)
        self.room_group_name = f'{self.user.token_notify}'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        print(f'{blue}[ONLINE] {self.user.username}  WAITING NOTIFICATION IN: {self.room_group_name}')
        await self.accept()


    async def disconnect(self, close_code):
        await self.apply_changes(False, self.user)
        print(f'{red}[OFFLINE] {self.user.username} CLOSED IN: {self.room_group_name}')
        await self.close()

    @sync_to_async
    def apply_changes(self, state, obj):
        obj.is_online = state
        obj.save()
    
    @sync_to_async
    def account_notification(self):
        try:
            notification = Notification.objects.get(id=self.id_notification)
            return notification.time
        except:
            return None

    @sync_to_async
    def make_notification(self, sender, recipient, state):
        notification = Notification.objects.create(sender=sender, account=recipient)
        if state:
            notification.invitation = True
        else:
            notification.message = True
        notification.save()
        self.id_notification = notification.id
    
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            command = data['command']

            if not command:
                return
            
            invited = data['receiver']
            self.reciver = await get_recipient(invited)
            if self.reciver == None:
                return
            if command == 'send-invitation-to':
                await self.make_notification(self.user, self.reciver, True)
                await self.send_notification(True)
            elif command == 'send-message-to':
                await self.make_notification(self.user, self.reciver, False)
                await self.send_notification(False)
            else:
                return
    
        except Exception as e:
            print(f'{red}[ERROR] -> [receive] [{e}]') 

    async def send_notification(self, state):
        try:
            notification_time = await self.account_notification()
            event_case = 'invitation' if state else 'message'
            await self.channel_layer.group_send(
                self.reciver.token_notify,
                {
                    'type': 'broadcast',
                    'id': self.id_notification,
                    'case': event_case,
                    'sender': self.user.username,
                    'time' : notification_time.strftime('%y/%m/%d %H:%M:%S'),
                    'full-name':  self.user.first_name + ' ' + self.user.last_name,
                    'picture': 'http://127.0.0.1:9000/users' + self.profile.avatar.url
                }
            )
        except Exception as e:
            print(f'{red}[ERROR] -> [send_notification] [{e}]') 
        
    async def broadcast(self, event):

        try:
            await self.send(text_data=json.dumps({
                'id': event['id'],
                'case': event['case'],
                'time': event['time'],
                'sender': event['sender'],
                'picture': event['picture'],
                'full-name': event['full-name'],
            }))
        except Exception as e:
            print(f'{red}[ERROR] -> [broadcast] {e}')

