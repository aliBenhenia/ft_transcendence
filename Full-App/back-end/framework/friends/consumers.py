import json, jwt, string, secrets
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from users.models import Register, Profile
from server_api import settings
from .models import Rooms
from datetime import datetime

# Helper function to generate a token
async def generate_token(length=32):
    return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(length))

# Fetch room token if it exists
async def get_room_token(user1, user2):
    try:
        room = await database_sync_to_async(Rooms.objects.get)(user_a=user1, user_b=user2)
        return room.room_token
    except Rooms.DoesNotExist:
        return None

# Create and save a new room token
async def create_room_token(user1, user2):
    room = await database_sync_to_async(Rooms.objects.create)(user_a=user1, user_b=user2)
    room.room_token = await generate_token(32)
    await database_sync_to_async(room.save)()
    return room.room_token

# Extract and authenticate user from JWT token
async def extract_auth_user(token):
    try:
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = decoded_token.get('user_id')
        if user_id:
            return await database_sync_to_async(Register.objects.get)(id=user_id), True
        return None, False
    except jwt.ExpiredSignatureError:
        return None, False
    except jwt.InvalidTokenError:
        return None, False

# Extract receiver user by username
async def get_recipient(username):
    try:
        return await database_sync_to_async(Register.objects.get)(username=username)
    except Register.DoesNotExist:
        return None

# Get Profile 
async def get_profile(auth):
    try:
        return await database_sync_to_async(Profile.objects.get)(client=auth)
    except:
        return None
    
class ChatConsumerApp(AsyncWebsocketConsumer):

    # This method is called when a WebSocket connection is initiated.
    # You can use it to accept or reject the connection.
    
    async def connect(self):
        try:
            # scope (attribute):
            # Contains information about the WebSocket connection, such as user information, path, and more. It's a dictionary-like object.
            
            token = self.scope['query_string'].decode().split('=')[1]


            self.user, is_authenticated = await extract_auth_user(token)
            if not is_authenticated:
                await self.close()
                return
            try:
                self.username = self.scope['url_route']['kwargs'].get('username')
            except:
                await self.close()
                return 
            
            if not self.username:
                await self.close()
                return

            recipient = await get_recipient(self.username)
            if not recipient:
                await self.close()
                return
            
            self.img = await database_sync_to_async(Profile.objects.get)(client=self.user)
            if not self.img:
                await self.close()
                return
            
            self.revclient = recipient.username
            self.room_token = await get_room_token(self.user.username, recipient.username)
            if not self.room_token:
                self.room_token = await get_room_token(recipient.username, self.user.username)
            if not self.room_token:
                self.room_token = await create_room_token(self.user.username, recipient.username)
            if not self.room_token:
                await self.close()
                return

            self.room_group_name = f'chat_{self.room_token}'
            
            # group_add(self, group_name, self_channel_name):
            # Adds the current WebSocket connection to a group. This is useful for broadcasting messages to multiple users.
            
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)

            print('[room_token]:', self.room_token)
            print('[group name]:', self.room_group_name)

            # accept(self, subprotocol=None)
            # This method accepts the WebSocket connection.

            await self.accept()
        
        except:
            
            #close(self, code=None):
            # This method closes the WebSocket connection with an optional closing code.
            
            await self.close()
        
    # This method is triggered when the WebSocket connection is closed.
    # You can handle cleanup tasks here, such as removing the user from a chat room.
    async def disconnect(self, close_code):

        # group_discard(self, group_name, self_channel_name):
        # Removes the WebSocket connection from a group.
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)


    # Broadcast message to room group
    # This method is called when a message is received from the WebSocket.
    # It handles incoming data (either text or binary).
    async def receive(self, text_data):
        

        try:
            data = json.loads(text_data)
            message = data['message']
            print('[+] : ', message)
            if not message:
                await self.close()
        
            obj = datetime.now()
            time = obj.strftime("%Y-%m-%d %H:%M:%S")
            
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'time': time,
                    'message': message,
                    'type': 'chat_message',
                    'reciver': self.revclient,
                    'sender': self.user.username,
                    'picture': 'http://127.0.0.1:9000/users' + self.img.avatar.url,
                }
            )
            # group_send(self, group_name, message):
            # Sends a message to all WebSocket connections in the group.
        except:
            # send(self, text_data=None, bytes_data=None, close=False):
            # This method sends a message back to the WebSocket. It can send either text or binary data.
            await self.send(text_data=json.dumps({'error': 'An error occurred while processing the message'}))
    
    async def chat_message(self, event):

        try:
            msg = event['message']
            sender = event['sender']

            await self.send(text_data=json.dumps({
                'message': msg,
                'sender': sender,
                'reciver': event['reciver'],
                'time': event['time'],
                'picture': event['picture'],
            }))
        except:
            await self.close()
    


# channel_name (attribute):

'''
# A unique identifier for the WebSocket connection.
'''

# channel_layer(attribute):

'''
# An interface to the channel layer, which is responsible for managing groups and sending messages between consumers.
'''

# In Django Channels, when you send a message using group_send, 

'''
# you specify a type in the message dictionary, such as 'type': 'chat_message'. 
# The value of this type corresponds to a method in your consumer class.
'''