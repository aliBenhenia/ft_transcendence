from friends.consumers import get_recipient, extract_auth_user, generate_token
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from users.models import Profile, Register
from .models import RoomTwoPlayer
from asgiref.sync import sync_to_async
import json
from django.db.models import Q
import asyncio

green = "\033[92m"
reset = "\033[0m"

'''
In Django, querysets are lazy, meaning they are not immediately executed when you create them
Lazy Evaluation of QuerySets
'''

class LiveGameFlow(AsyncWebsocketConsumer):
    
    async def connect(self):
        try:
            token = self.scope['query_string'].decode().split('=')[1]
            self.user, is_authenticated = await extract_auth_user(token)
            if not is_authenticated:
                await self.close()
                return
            
            self.target = self.scope['url_route']['kwargs'].get('username')
            self.reciver = await get_recipient(self.target)
            if not self.reciver:
                await self.delete_token()
                return await self.close()

            if self.reciver.token_game != self.user.token_game:
                await self.close()

            self.room_group_name = f'{self.user.token_game}'
            print(f'{green}[+] {self.user.username} opening match to room : {self.room_group_name}')
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()
            self.ball = {
                'x': 400,
                'y': 300,
                'vx': 5,
                'vy': 5
            }
            self.update_ball_task = asyncio.create_task(self.update_ball())
        except:
            await self.close()
    
    async def update_ball(self):
        
        while True:
            # Update ball position
            self.ball['x'] += self.ball['vx']
            self.ball['y'] += self.ball['vy']

            # self.room_group_name

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_ball_update',
                    'ball': self.ball
                }
            )

            await asyncio.sleep(1 / 60)

    async def send_ball_update(self, event):
        await self.send(text_data=json.dumps({
            'ball': event['ball']
        }))


    async def disconnect(self, close_code):
        await self.close()
    
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)

            #command = data['command']
            #if command == 'position':
                #await self.Session(data)
        
        except Exception as e:
            print(f'[ERROR] receive : {e}')
    
    @sync_to_async
    def destroy_token(self, obj):
        obj.token_game = ''
        obj.save()

    async def broadcast(self, event):

        try:
    
            sender = event['sender']
            message = event['message']
            command = event['command']

            await self.send(text_data=json.dumps({
                'sender': sender,
                'command': command,
                'message': message,
            }))

        except Exception as e:
            print(f'[ERROR] broadcast Quit: {e}')


class PlayerConsumerApp(AsyncWebsocketConsumer):

    async def connect(self):
        try:
            token = self.scope['query_string'].decode().split('=')[1]
            self.user, is_authenticated = await extract_auth_user(token)
            if not is_authenticated:
                await self.close()
                return

            self.room_group_name = f'{self.user.id}'
            print(f'{green}[+] {self.user.username} opening connection to room : {self.room_group_name}')
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()

        except:
            await self.close()

    async def disconnect(self, close_code):
        await self.close()

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            command = data['command']

            if not command:
                await self.close()
                return

            if command == 'invite':
                self.destroy_token(self.user)
                self.reciver = await get_recipient(data['sendto'])
                await self.on_communicate('invite')

            elif command == 'cancel':
                self.reciver = await get_recipient(data['sendback'])
                await self.destroy_token(self.reciver)
                await self.destroy_token(self.user)
                await self.on_communicate('cancel')

            elif command == 'accept':
                self.destroy_token(self.user)
                
                self.reciver = await get_recipient(data['sendback'])
                self.on_accpet = await generate_token(32)
            
                await self.save_token(self.reciver, self.on_accpet)
                await self.save_token(self.user, self.on_accpet)

                print(f'{green}[+] TOKEN : ', self.on_accpet)
                await self.on_communicate('accept')
            
            elif command == 'position':
                if self.reciver.token_game != self.user.token_game:
                    self.destroy_token(self.user)
                    return await self.close()
                print(f'{green}[+] OK : ')

                await self.Session(data)

        except Exception as e:
            print(f'[ERROR] Receive: {e}')
            await self.send(text_data=json.dumps({'error': 'An error occurred while processing the request'}))

    async def on_communicate(self, state):
        try:
            await self.channel_layer.group_send(
                str(self.reciver.id),
                {
                    'type': 'broadcast',
                    'command': state,
                    'sender': self.user.username,
                }
            )
        except Exception as e:
            print(f'[ERROR] Accept Invitation: {e}')
    
    async def Session(self, data):
        try:
            await self.channel_layer.group_send(
                str(self.reciver.id),
                {
                    'type': 'broadcast',
                    'command': data['command'],
                    'sender': self.user.username,
                    'message': data['message'],
                }
            ) 
        except Exception as e:
            print(f'[ERROR] LiveSessions Quit: {e}')
    
    async def broadcast(self, event):

        try:
            sender = event['sender']
            command = event['command']

            if command == 'position':

                await self.send(text_data=json.dumps({
                    'command': command,
                    'sender': sender,
                    'message' : event['message']
                }))
            
            else:
                await self.send(text_data=json.dumps({
                    'command': command,
                    'sender': sender,
                }))

        except Exception as e:
            print(f'[ERROR] Broadcast: {e}')
    
    
    @sync_to_async
    def save_token(self, obj, token):
        obj.token_game = token
        obj.save()
    
    @sync_to_async
    def destroy_token(self, obj):
        obj.token_game = ''
        obj.save()
    


    
































'''

# consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("pingpong_game", self.channel_name)
        await self.accept()
        self.ball = {
            'x': 400,  # initial X position
            'y': 300,  # initial Y position
            'vx': 5,   # velocity in X direction
            'vy': 5    # velocity in Y direction
        }
        self.update_ball_task = asyncio.create_task(self.update_ball())

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("pingpong_game", self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        # Handle player input or commands if needed

    async def update_ball(self):
        while True:
            # Update ball position
            self.ball['x'] += self.ball['vx']
            self.ball['y'] += self.ball['vy']

            # Emit updated ball position to all connected clients
            await self.channel_layer.group_send(
                "pingpong_game",
                {
                    'type': 'send_ball_update',
                    'ball': self.ball
                }
            )

            # Delay for a frame rate (e.g., 60 FPS)
            await asyncio.sleep(1 / 60)

    async def send_ball_update(self, event):
        await self.send(text_data=json.dumps({
            'ball': event['ball']
        }))


'''





'''
self.scope: Refers to the scope dictionary available in Django Channels that contains information about the WebSocket connection.

['headers']: Accesses the HTTP headers from the scope.
[1]: The second element of the headers list, which contains the headers as a list of tuples. Each tuple consists of a key-value pair.
[1]: The second item of the tuple, which is the value of the header. Typically, this is the Host header which includes 
the domain or IP address and port number.

'''
            
'''
            self.current_profile = await database_sync_to_async(Profile.objects.get)(client=self.user)
            if not self.current_profile:
                await self.close()
                return
            
            self.second_profile = await database_sync_to_async(Profile.objects.get)(client=rg_player)
            if not self.second_profile:
                await self.close()
                return
            
            self.players_token = await database_sync_to_async(RoomTwoPlayer.objects.is_player_token_exist)(self.user, rg_player)
            if self.players_token is None:
                self.players_token = await generate_token(32)
                room = await database_sync_to_async(RoomTwoPlayer.objects.create)(player_one=self.user, player_two=rg_player, room_token=self.players_token)
                await database_sync_to_async(room.save)()
            

        

            print('[room_token]:', self.players_token)
            print('[group name]:', self.room_group_name)
'''