from .models import MESSAGES
from datetime import datetime
from django.db.models import Q
from friends.models import FRIENDS
from friends.tools import is_blocked
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

def create_message(sender, reciver, message):
    obj = MESSAGES.objects.create(sender=sender, account=reciver, message=message)
    obj.save()
    return obj

def account_status(account, client):
    is_friends = FRIENDS.objects.filter(Q(account=account, friends=client) | Q(account=client, friends=account)).first()
    if is_friends:
        return True
    return False

def chat_structure(account, client):
    relation = True if FRIENDS.objects.filter(Q(friends=client, account=account) | Q(friends=account, account=client)).first() else False
    sender_info = {
        'on_talk': client.username,
        'online': client.is_online,
        'picture': client.photo_url,
        'full_name': f"{client.first_name} {client.last_name}",
    }
    if relation:
        is_blk, option = is_blocked(account, client)
        if is_blk:
            sender_info['by'] = account.username if option else client.username
            sender_info['blocked'] = True
    if not is_blk:
        sender_info['friends'] = relation
    messages = MESSAGES.objects.filter(Q(sender=client, account=account) | Q(sender=account, account=client)).last()
    if not messages:
        sender_info['vide-message'] = True
    else:
        sender_info['message'] = messages.message,
        sender_info['sender'] = messages.sender.username,
        sender_info['reciver'] = messages.account.username,
        sender_info['time'] = messages.time.strftime('%Y-%m-%d %H:%M:%S'),
    return sender_info

def new_message(sender, reciver, data):
    channel_layer = get_channel_layer()
    notification_data =  {
        'type': 'notify_message',
        'sender' : sender.username,
        'picture' : str(sender.photo_url),
        'full-name' : f"{sender.first_name} {sender.last_name}",

        'message' : data.message,
        'time' : data.time.strftime('%Y-%m-%d %H:%M:%S'),
    }
    print("111111")
    async_to_sync(channel_layer.group_send)(reciver.token_notify,notification_data)
    return True