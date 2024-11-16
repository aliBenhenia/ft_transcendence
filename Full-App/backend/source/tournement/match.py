import json
import asyncio
from .models import Competition
from django.utils import timezone
from asgiref.sync import sync_to_async
from notification.socket import extract_auth_user
from channels.generic.websocket import AsyncWebsocketConsumer

class LiveTournement(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            await self.accept()
        except Exception as e:
            print(f'[ERROR] connect: {e}')
    
    async def disconnect(self, close_code):
        await self.close()


'''
from .asynctools import get_refrence, get_position, get_second, on_quite

green = "\033[92m"

    Data = {}
    players = {}
    goals = {"goals": []}  # Static dictionary to store goals
    async def connect(self):
        try:
            token = self.scope['query_string'].decode().split('=')[1]
            self.user, is_authenticated = await extract_auth_user(token)
            if is_authenticated:
                
                self.token, state = await get_refrence(self.user)
                if not state or not token:
                    await self.close()
                
                self.reciver = await get_second(self.token, self.user)
                if not self.reciver:
                    await self.close()
                self.MainLoop = await get_position(self.token, self.user)

                # ----------------- MAIN LOGIC  ----------------- #
                
                self.u0, self.u1 = (True, False) if self.MainLoop == 1 else (False, True)
                print(f"{green}[+]  {self.u0} | {self.u1}")
                self.data_track = {'sender': self.user.username, 'message': None, 'left_score': 0, 'right_score': 0, 'quit': False}
                LiveTournement.players[self.user.username] = self.data_track
                
                # ----------------------------------------------- #

                print(f"{green}[+] [{self.MainLoop}] {self.user.username} | {self.reciver.username} = {self.token}")
                await self.channel_layer.group_add(self.token, self.channel_name)
                await self.accept()

            else:
                await self.close()
        except Exception as e:
            print(f'[ERROR] connect: {e}')

    async def disconnect(self, close_code):

        await self.close()
    
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            if data['command'] == 'quit':
                print(f"{green}[+] {self.user.username} has quit the game.")
                await on_quite(self.token, self.user)

            asyncio.create_task(self.Session(data))
        except Exception as e:
            print(f'[ERROR] receive : {e}')
    
    async def Session(self, data):
        """Handles sending different types of game data (ball, score, quit)."""
        try:
            await self.channel_layer.group_send(
                self.token,
                {
                    'type': 'broadcast',
                    'command': data['command'],
                    'sender': self.user.username,
                    'message': data['message']
                }
            )
        except Exception as e:
            print(f'[ERROR] Session Quit: {e}')

    async def broadcast(self, event):
        """Broadcasts data to all players."""
        try:
            await self.send(text_data=json.dumps({
                'sender': event['sender'],
                'command': event['command'],
                'message': event['message'],
            }))
        except Exception as e:
            print(f'[ERROR] broadcast Quit: {e}')
'''