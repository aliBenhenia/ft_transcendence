import json, jwt
from server import settings
from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from notification.models import Register, NOTIFY
from channels.generic.websocket import AsyncWebsocketConsumer
from pingpong.handle import forward_event_pingpong, on_sending

green = "\033[92m"
OFFLINE = '1337'

class Notifications(AsyncWebsocketConsumer):
    # Dictionary to track the number of active connections per user
    ONLINE = {}

    async def connect(self):
        try:
            # Extract and authenticate user token
            token = self.scope['query_string'].decode().split('=')[1]
            self.user, is_authenticated = await extract_auth_user(token)
            
            if is_authenticated:
                await self.set_online_status(True)  # Mark user as online in DB
                await self.accept()
                await self.add_user_to_online_group()  # Track online status in memory
                
                print(f'{green}[+] {self.user.username} connected to room: {self.user.token_notify}')
                await self.channel_layer.group_add(self.user.token_notify, self.channel_name)
                await self.channel_layer.group_add(OFFLINE, self.channel_name)
            else:
                await self.close()
        except Exception as e:
            print(f'[ERROR] Connection failed: {e}')
            await self.close()

    @database_sync_to_async
    def set_online_status(self, status):
        """Updates user's online status in the database."""
        if self.user:
            self.user.is_online = status
            self.user.save()

    async def add_user_to_online_group(self):
        """Add user to online group and manage online status in memory."""
        if not Notifications.ONLINE.get(self.user.username):
            # If user has no active connections, add them as online and broadcast status
            Notifications.ONLINE[self.user.username] = 1
            await self.broadcast_connection_status('ONLINE')
        else:
            # If user already has an active connection, just increment the count
            Notifications.ONLINE[self.user.username] += 1

    async def disconnect(self, close_code):
        # Decrement active connections count for the user
        active_connections = Notifications.ONLINE.get(self.user.username, 0)

        if active_connections <= 1:
            # Last connection is closing, mark the user as offline
            await self.set_online_status(False)
            Notifications.ONLINE.pop(self.user.username, None)
            await self.broadcast_connection_status('OFFLINE')
        else:
            # Reduce the count but don't mark the user offline since other tabs are open
            Notifications.ONLINE[self.user.username] -= 1

        # Remove the user from the groups as this connection closes
        await self.channel_layer.group_discard(self.user.token_notify, self.channel_name)
        await self.channel_layer.group_discard(OFFLINE, self.channel_name)
        await self.close()

    async def broadcast_connection_status(self, status):
        """Notify all users in the OFFLINE group of the user's status change."""
        try:
            await self.channel_layer.group_send(
                OFFLINE,
                {
                    'type': 'on_broadcast',
                    'sender': self.user.username,
                    'case': status,
                }
            )
        except Exception as e:
            print(f'[ERROR] Broadcasting status: {e}')

    async def on_broadcast(self, event):
        """Receive broadcast messages and send to WebSocket."""
        await self.send_json({
            'case': event['case'],
            'sender': event['sender'],
        })

    async def receive(self, text_data):
        """Handle received WebSocket messages and commands."""
        try:
            information = json.loads(text_data)
            command = information.get('command')

            if command in {'invite', 'accept', 'cancel'}:
                receiver, is_valid = await get_recipient(information['receiver'])
                if is_valid:
                    await forward_event_pingpong(self, information, receiver, self.user)
        except Exception as e:
            print(f'[ERROR] Processing command: {e}')

    async def broadcast(self, event):
        """Send broadcast event to WebSocket."""
        await self.send_json({
            'time': event['time'],
            'case': event['case'],
            'sender': event['sender'],
            'picture': event['picture'],
            'full-name': event['full-name'],
        })

    async def notify_message(self, event):
        """Send notification message to WebSocket."""
        await self.send_json({
            'case': 'NEW_MESSAGE',
            'time': event['time'],
            'message': event['message'],
            'sender': event['sender'],
            'picture': event['picture'],
            'full-name': event['full-name'],
        })

    async def on_forward(self, event):
        """Forward the event to the WebSocket."""
        await on_sending(self, event)

    async def send_json(self, data):
        """Helper method to send JSON data over WebSocket."""
        await self.send(text_data=json.dumps(data))


# Authentication helper to decode token and retrieve user
async def extract_auth_user(token):
    try:
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = decoded_token.get('user_id')
        user = await database_sync_to_async(Register.objects.get)(id=user_id)
        return user, True
    except Register.DoesNotExist:
        return None, False

# Helper to get recipient by username
async def get_recipient(username):
    try:
        user = await database_sync_to_async(Register.objects.get)(username=username)
        return user, True
    except Register.DoesNotExist:
        return None, False
