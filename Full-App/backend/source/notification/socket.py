
import json, jwt
from server import settings
from asgiref.sync import sync_to_async
#from tournement.tools import on_tournement
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from notification.models import Register, NOTIFY
from channels.generic.websocket import AsyncWebsocketConsumer
from pingpong.handle import forward_event_pingpong, on_sending

#from tournement.invite import invite_friend, forward_event_tournemet

green = "\033[92m"
OFFLINE = '1337'

channel_store = {}

class Notifications(AsyncWebsocketConsumer):

    ONLINE = {}
    async def connect(self):
        try:
            token = self.scope['query_string'].decode().split('=')[1]
            self.user, is_authenticated = await extract_auth_user(token)
            if is_authenticated:
                await self.accept()
                await self.apply_changes(True)
                if not Notifications.ONLINE.get(self.user.username):
                    Notifications.ONLINE[self.user.username] = 1
                    await self.on_connection('ONLINE')
               
                print("[ACTIVE CONNECTIONS] : ", Notifications.ONLINE[self.user.username])
                print(f'{green}[+] {self.user.username} opening match to room : {self.user.token_notify}')
                await self.channel_layer.group_add(self.user.token_notify, self.channel_name)
                await self.channel_layer.group_add(OFFLINE, self.channel_name)
                channel_store[self.user.id] = self.channel_name
            else:
                await self.close()
        except:
            await self.close()

    @sync_to_async
    def apply_changes(self, state):
        if self.user:
            self.user.is_online = state
            self.user.save()
    
    async def disconnect(self, close_code):
        if Notifications.ONLINE.get(self.user.username):
            del Notifications.ONLINE[self.user.username]
            await self.on_connection('OFFLINE')
            await self.apply_changes(False) 
        await self.close()

    async def on_connection(self, connection):
        try:
            await self.channel_layer.group_send(
                OFFLINE,
                {
                    'type': 'on_broadcast',
                    'sender': self.user.username,
                    'case' : connection,
                }
            )
        except Exception as e:
            print(f'[ERROR] Accept Invitation: {e}')

    async def on_broadcast(self, event):
        try:
            await self.send(text_data=json.dumps({
                'case': event['case'],
                'sender': event['sender'],
            }))
        except:
            pass
    
    async def receive(self, text_data):
        try:
            information = json.loads(text_data)
            command = information['command']

            if command == 'invite' or command == 'accept' or command == 'cancel':
                reciver, state = await get_recipient(information['reciver'])
                if state:
                    await forward_event_pingpong(self, information, reciver, self.user)
            
            if command == 't-invite' or command == 't-accept' or command == 't-group':
                if command == 't-group':
                    print("")
                    #await forward_event_tournemet(self, information, None, self.user)
                else:
                    reciver, state = await get_recipient(information['reciver'])
                    if state:
                        await forward_event_tournemet(self, information, reciver, self.user)
    
            
        except Exception as e:
            print('[+] : ', e)

    async def broadcast(self, event):
        try:
            await self.send(text_data=json.dumps({
                'time': event['time'],
                'case': event['case'],
                'sender': event['sender'],
                'picture': event['picture'],
                'full-name': event['full-name']
            }))
        except:
            pass
    
    async def notify_message(self, event):
        try:
            await self.send(text_data=json.dumps({
                'case': 'NEW_MESSAGE',
                'time': event['time'],
                'message' : event['message'],

                'sender': event['sender'],
                'picture': event['picture'],
                'full-name': event['full-name'],
            }))
        except:
            pass

    async def on_forward(self, event):
        await on_sending(self, event)

    async def forward_to(self, event):
        pass
        #await on_tournement(self, event)
    
    async def on_invite_friend(self, event):
        pass
        #await invite_friend(self, event)
    async def INSTRUCTION(self, event):
        try:
            await self.send(text_data=json.dumps({
                'case': event['case'],
                'sender': event['sender'],
                'command': event['command'],
            }))
        except:
            pass


async def extract_auth_user(token):
    try:
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = decoded_token.get('user_id')
        return await database_sync_to_async(Register.objects.get)(id=user_id), True
    except:
        return None, False

async def get_recipient(username):
    try:
        return await database_sync_to_async(Register.objects.get)(username=username), True
    except:
        return None, False