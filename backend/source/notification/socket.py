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
    ONLINE = {}

    async def connect(self):
        try:
            self.user = self.scope['user']
            await self.accept()
            if self.user:
                await self.set_online_status(True)
                await self.add_user_to_online_group()
                
                print(f'{green}[+] {self.user.username} connected to room: {self.user.token_notify}')
                await self.channel_layer.group_add(self.user.token_notify, self.channel_name)
                await self.channel_layer.group_add(OFFLINE, self.channel_name)
            else:
                await self.send(json.dumps({'case':'unauthorized'}))
                return await self.close()
        except Exception as e:
            await self.close()

    @database_sync_to_async
    def set_online_status(self, status):
        if self.user:
            self.user.is_online = status
            self.user.save(update_fields=['is_online'])

    async def add_user_to_online_group(self):
        if not Notifications.ONLINE.get(self.user.username):
            Notifications.ONLINE[self.user.username] = 1
            await self.broadcast_connection_status('ONLINE')
        else:
            Notifications.ONLINE[self.user.username] += 1

    async def disconnect(self, close_code):
        if self.user is None:
            return
        active_connections = Notifications.ONLINE.get(self.user.username, 0)
        if active_connections <= 1:
            await self.set_online_status(False)
            Notifications.ONLINE.pop(self.user.username, None)
            await self.broadcast_connection_status('OFFLINE')
        else:
            Notifications.ONLINE[self.user.username] -= 1
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

    async def game_invite(self, event):
        await self.send_json({
            'case': 'GAME_INVITE',
            'room_name': event['room_name'],
            'sender': event['sender'],
            'picture': event['picture'],
            'full-name': event['full-name'],
        })

    async def join_room(self, event):
        await self.send_json({
            'case': 'GAME_READY',
            'room_name' : event['room_name'],
        })

    async def game_rejected(self, event):
        await self.send_json({
            'case': 'GAME_REJECTED',
            'sender': event['sender'],
            'picture': event['picture'],
            'full-name': event['full-name'],
        })

    async def on_forward(self, event):
        await on_sending(self, event)

    async def send_json(self, data):
        await self.send(text_data=json.dumps(data))
