import json
from notification.socket import extract_auth_user, get_recipient
from channels.generic.websocket import AsyncWebsocketConsumer
import random
import string
import asyncio

green = "\033[92m"



class LiveGameFlow(AsyncWebsocketConsumer):
    games = {}
    game_queue = []

    @staticmethod
    def generate_room_id():
        return ''.join(random.choices(string.ascii_lowercase + string.digits, k=9))

    async def add_to_waiting_queue(self):
        LiveGameFlow.game_queue.append(self)
        print(f"Player added to waiting queue. Queue size: {len(self.game_queue)}")
        if len(self.game_queue) == 1:
            await self.send(text_data=json.dumps(
            {
                'type': 'waiting',
                'message': 'Waiting for another player to join...'
            }))
        elif len(self.game_queue) == 2:
            await self.send(text_data=json.dumps(
            {
                'type': 'ready',
                'message': 'Players Ready'
            }))
        # await self.match_players()

    async def match_players(self):
        if len(self.game_queue) == 2:
            player1 = LiveGameFlow.game_queue.pop(0)
            player2 = LiveGameFlow.game_queue.pop(0)
            room_name = self.generate_room_id()
            LiveGameFlow.games[room_name] = {'players' : [player1, player2]}
            for player in [player1, player2]:
                player.room_name = room_name
            asyncio.create_task(self.game_task(room_name))

    async def game_task(self, room_name):
        while room_name in LiveGameFlow.games:
            if len(LiveGameFlow.games[room_name]['players']) < 2:
                if len(LiveGameFlow.games[room_name]['players']) == 1:
                    remaining_player = LiveGameFlow.games['players'][0]

    async def connect(self):
        await self.accept()
        print("New connection established")
        await self.add_to_waiting_queue()

        # try:
        #     token = self.scope['query_string'].decode().split('=')[1]
        #     self.user, is_authenticated = await extract_auth_user(token)
        #     if is_authenticated:
        #         self.target = self.scope['url_route']['kwargs'].get('username')
        #         self.reciver, authenticated = await get_recipient(self.target)
        #         if not authenticated:
        #             self.close()
        #         if self.user.token_game == None:
        #             await self.close()
        #         if self.reciver.token_game != self.user.token_game:
        #             await self.close()
        #         print(f'{green}[+] {self.user.username} vs {self.reciver.username} : {self.user.token_game}')
        #         await self.channel_layer.group_add(self.user.token_game, self.channel_name)
        #         await self.accept()
        #     else:
        #         self.close()
        # except Exception as e:
        #     print(f'[ERROR] Quit: {e}')

    
    async def disconnect(self, close_code):
        if self in LiveGameFlow.game_queue:
            LiveGameFlow.game_queue.remove(self)
        if hasattr(self, 'room_name') and room_name in LiveGameFlow.games:
            game = LiveGameFlow.games[self.room_name]
            game['players'].remove(self)
            if game['players']:
                remaining_player = game['player'][0]
                try:
                    await remaining_player.send(text_data=json.dumps(
                    {
                        'type' : 'game ends',
                        'message' : 'You win! Opponent disconnected'
                    }))
                except:
                    pass
                del LiveGameFlow.games[self.room_name]

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            await self.Session(data)
        except Exception as e:
            print(f'[ERROR] receive : {e}')
    
    async def Session(self, data):
        try:
            await self.channel_layer.group_send(
                self.reciver.token_game,
                {
                    'type': 'broadcast',
                    'command': data['command'],
                    'sender': self.user.username,
                    'message': data['message'] if data['command'] == 'position' else '',
                }
            ) 
        except Exception as e:
            print(f'[ERROR] LiveSessions Quit: {e}')

    # async def broadcast(self, event):
    #     try:
    #         sender = event['sender']
    #         message = event['message']
    #         command = event['command']

    #         await self.send(text_data=json.dumps({
    #             'sender': sender,
    #             'command': command,
    #             'message': message,
    #         }))

    #     except Exception as e:
    #         print(f'[ERROR] broadcast Quit: {e}')
