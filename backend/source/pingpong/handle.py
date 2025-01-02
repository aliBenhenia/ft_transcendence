import json
from register.models import generate_token
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync, sync_to_async


async def forward_event_pingpong(intstance, data, reciver, sender):
    notification_data =  {
        'type': 'on_forward',
        'sender' : sender.username,
        'command' : data['command'],
    }
    if data['command'] == 'invite':
        token = generate_token(32)
        await save_token(sender, f"{token}-iv")
    elif data['command'] == 'accept':
        await save_token(sender, reciver.token_game)
    elif data['command'] == 'cancel':
        await save_token(sender, None)
        await save_token(reciver, None)
    await intstance.channel_layer.group_send(reciver.token_notify, notification_data)

async def on_sending(consumer_instance, event):
    try:
        await consumer_instance.send(text_data=json.dumps({
            'case': 'PINGPONG',
            'sender': event['sender'],
            'command' : event['command']
        }))
    except Exception as e:
        print('[+] : ', e)

@sync_to_async
def save_token(obj, token):
    obj.token_game = token
    obj.save()
