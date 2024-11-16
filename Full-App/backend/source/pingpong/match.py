from notification.socket import extract_auth_user, get_recipient
from channels.generic.websocket import AsyncWebsocketConsumer
import json, time
import asyncio
from django.utils import timezone
from .tools import on_save_match
from .pingpong import initialize_game, update_ball, reset_ball, handle_ball_collisions, check_side_collision, check_score, cleanup_game, update_paddle_position, upadte_data, check_end_game

green = "\033[92m"
red = "\033[91m"
yellow = "\033[93m"

async def tokenCheck(token):
    if token.endswith('-iv'):
        return True, token.split('-')[0]
    return False, token

class LiveGameFlow(AsyncWebsocketConsumer):
    Data = {}
    players = {}
    goals = {"goals": []}  # Static dictionary to store goals
    async def connect(self):
        try:
            self.time_start = timezone.now()
            token = self.scope['query_string'].decode().split('=')[1]
            self.user, is_authenticated = await extract_auth_user(token)
            if is_authenticated:
                self.target = self.scope['url_route']['kwargs'].get('username')
                self.reciver, authenticated = await get_recipient(self.target)
                self.u0, self.is_me = await tokenCheck(self.user.token_game)
                self.u1, self.on_check = await tokenCheck(self.reciver.token_game)
                print("[+] user : ", self.is_me)
                print("[+] reciver : ", self.on_check)

                if not authenticated or not self.is_me or self.on_check != self.is_me:
                    await self.close()
                    return
                
                # --------------------------------------------------------------
                self.data_track = {'sender': self.user.username, 'message': None, 'left_score': 0, 'right_score': 0, 'quit': False}
                LiveGameFlow.players[self.user.username] = self.data_track
                # --------------------------------------------------------------

                print(f'{green}[+] {self.user.username} vs {self.reciver.username} : {self.is_me}')
                await self.channel_layer.group_add(self.is_me, self.channel_name)
                await self.accept()
                # Initialize game variables
                self.ball, self.playerLeft, self.playerRight, self.scoreboard, self.start, self.start_time, self.time_start, self.is_end  = initialize_game() 
                if self.u0 and not self.u1:
                    # wating 5 seconds to start the game
                    if not f"{self.is_me}" in LiveGameFlow.Data:
                        await asyncio.sleep(3)
                        await self.Session({ 'command': 'ready', 'message': "ready" })
                    # # Start the game
                    self.update_ball_task = asyncio.create_task(update_ball(
                        self, self.ball, self.user, self.reciver, self.scoreboard, self.playerLeft, self.playerRight, self.start_time, 
                        self.send_score_update, self.u0, self.start, self.is_end, LiveGameFlow, self.data_track, self.time_start, self.Session, self.is_me
                    ))
            else:
                await self.close()

        except Exception as e:
            print(f'[ERROR] Quit: {e}')

    async def disconnect(self, close_code):
        # Optionally cancel the update task if it's still running
        if hasattr(self, 'update_ball_task'):
            self.update_ball_task.cancel()
        
        await self.close()

    async def send_score_update(self, data):
        """Sends score update to the group."""
        try:
            await self.channel_layer.group_send(
                self.is_me,  # Use the game token as the group name
                {
                    'type': 'send_score',  # Event type (must match the receiving method)
                    'message': data  # Score data being sent
                }
            )
        except Exception as e:
            print(f'[ERROR] send_score_update Quit: {e}')

    async def send_score(self, event):
        """Handles sending the score update to the client."""
        await self.send(text_data=json.dumps({
            'command': 'score',
            'message': event['message']  # Score data from the event
        }))

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            asyncio.create_task(self.Session(data))
        except Exception as e:
            print(f'[ERROR] receive : {e}')

    async def Session(self, data):
        """Handles sending different types of game data (ball, score, quit)."""
        try:
            await self.channel_layer.group_send(
                self.is_me,
                {
                    'type': 'broadcast',
                    'command': data['command'],
                    'sender': self.user.username,
                    'message': data['message']
                }
            )
            # Update game data tracking based on the type of data
            self.data_track = await upadte_data(data, LiveGameFlow, self.user, self.reciver, self.time_start, self.data_track)
        except Exception as e:
            print(f'[ERROR] LiveSessions Quit: {e}')


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