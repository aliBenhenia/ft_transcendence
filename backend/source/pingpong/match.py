import json
from notification.socket import extract_auth_user, get_recipient
from channels.generic.websocket import AsyncWebsocketConsumer

green = "\033[92m"



class LiveGameFlow(AsyncWebsocketConsumer):
    
    async def connect(self):
        try:
            token = self.scope['query_string'].decode().split('=')[1]
            self.user, is_authenticated = await extract_auth_user(token)
            if is_authenticated:
                self.target = self.scope['url_route']['kwargs'].get('username')
                self.reciver, authenticated = await get_recipient(self.target)
                if not authenticated:
                    self.close()
                if self.user.token_game == None:
                    await self.close()
                if self.reciver.token_game != self.user.token_game:
                    await self.close()
                print(f'{green}[+] {self.user.username} vs {self.reciver.username} : {self.user.token_game}')
                await self.channel_layer.group_add(self.user.token_game, self.channel_name)
                await self.accept()
            else:
                self.close()
        except Exception as e:
            print(f'[ERROR] Quit: {e}')

    
    async def disconnect(self, close_code):
        await self.close()
    
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
