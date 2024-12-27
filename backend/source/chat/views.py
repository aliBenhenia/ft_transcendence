from .models import MESSAGES
from datetime import datetime
from django.db.models import Q
from .cases import ERROR, SUCCESS
from friends.models import FRIENDS
from register.models import Register
from asgiref.sync import async_to_sync
from security.tools import AccountLookup
from rest_framework.response import Response
from channels.layers import get_channel_layer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .tools import create_message, account_status, is_blocked, chat_structure, new_message, invite
import json
from .models import GameInvite
from pingpong.match import LiveGameFlow 

@api_view(['GET'])
def fix_online(request):
    obj = Register.objects.all()
    for o in obj:
        o.is_online = False
        o.save()
    return Response({'success'  : 'ok'}, status=200)
    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def query_conversation(request):
    account = request.user
    if account.SECURE.activate:
        if account.SECURE.on_login:
            return Response({'2FA': True, 'error': ERROR[1]}, status=401)
    search = request.GET.get('account')
    if not search:
        return Response({'error': ERROR[3]}, status=400)
    obj, state = AccountLookup(search)
    if not state:
        return Response({'error': ERROR[2]}, status=404)
    messages = MESSAGES.objects.filter(Q(sender=obj, account=account) | Q(sender=account, account=obj)).order_by('-time')

    if not messages:
        return Response({'vide': True, 'message': SUCCESS[1], 'online': obj.is_online}, status=200)

    data = []
    sender_info = {
        'on_talk': obj.username,
        'online': obj.is_online,
        'picture': obj.photo_url,
        'full_name': f"{obj.first_name} {obj.last_name}",
    }
    is_blk, option = is_blocked(account, obj)
    if is_blk:
        sender_info['by'] = account.username if option else obj.username
        sender_info['blocked'] = True
    if not is_blk:
        sender_info['friends'] = account_status(account, obj)
    for m in messages:
        informations = {
            'sender' : m.sender.username,
            'reciver': m.account.username,
            'message': m.message,
            'time': m.time.strftime('%Y-%m-%d %H:%M:%S'),
        }
        data.append(informations)
    return Response({'vide': False, 'sender-info': sender_info, 'data': reversed(data)}, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_conversation(request):
    account = request.user
    if account.SECURE.activate:
        if account.SECURE.on_login:
            return Response({'2FA': True, 'error': ERROR[1]}, status=401)
    
    messages = MESSAGES.objects.filter(Q(account=account) | Q(sender=account))
    if not messages:
        return Response({'vide': True, 'message': SUCCESS[1]}, status=200)
    chats = []
    for message in messages:
        client = message.account if message.account != account else message.sender
        if client.username not in chats:
            chats.append(client.username)
            chats.append(chat_structure(account, client))
    return Response({'vide': False, 'info' : chats}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    account = request.user
    if account.SECURE.activate:
        if account.SECURE.on_login:
            return Response({'2FA' : True, 'error' : ERROR[1]}, status=401)

    INFO = request.data
    reciver = INFO.get('account')
    if not reciver:
        return Response({'error': ERROR[3]}, status=400)
    obj, state = AccountLookup(reciver)
    if not state:
        return Response({'error': ERROR[2]}, status=404)
    message = INFO.get('message')
    if not message:
        return Response({'error': ERROR[5]}, status=400)

    is_blk, option = is_blocked(account, obj)
    if is_blk:
        if option:
            return Response({'error': ERROR[8]}, status=400)
        return Response({'error': ERROR[9]}, status=400)

    new = create_message(account, obj, message)
    new_message(account, obj, new)
    return Response({'success': SUCCESS[2]}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_game_invite(request):
    sender = request.user
    if sender.SECURE.activate:
        if sender.SECURE.on_login:
            return Response({'2FA' : True, 'error' : ERROR[1]}, status=401)
    data = request.data
    receiver = data.get('to_invite')
    print (receiver)
    if not receiver:
        return Response({'error': ERROR[3]}, status=400)
    to_invite, state = AccountLookup(receiver)
    if not state:
        return Response({'error': ERROR[2]}, status=404)
    is_blk, option = is_blocked(sender, to_invite)
    if is_blk:
        if option:
            return Response({'error': ERROR[8]}, status=400)
        return Response({'error': ERROR[9]}, status=400)

    channel_layer = get_channel_layer()
    room_name = LiveGameFlow.generate_room_id()
    LiveGameFlow.games[room_name] = {}
    GameInvite.objects.create(room_name=room_name, inviter=sender, invited=to_invite,status='pending')
    notification_data =  {
        'type': 'game_invite',
        'room_name' : room_name,
        'sender' : sender.username,
        'picture' : str(sender.photo_url),
        'full-name' : f"{sender.first_name} {sender.last_name}",
    }    
    async_to_sync(channel_layer.group_send)(to_invite.token_notify, notification_data)
    return Response({'success': SUCCESS[3]}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_game_invite(request):
    receiver = request.user
    if not request.body:
        return Response({"error": "Empty request body"}, status=400)
    try:
        data = json.loads(request.body)
    except:
        return Response({"error": "Invalid JSON format"}, status=400)
    room_name = data.get('room_name', '')
    try:
        game_invite = GameInvite.objects.get(room_name=room_name, invited=receiver, status='pending')
    except GameInvite.DoesNotExist:
        return Response({'error': 'Invalid game invite'}, status=400)
    game_invite.status = 'accepted'
    game_invite.save()
    inviter = game_invite.inviter
    invited = receiver
    players = [inviter, invited]
    channel_layer = get_channel_layer()
    for player in players:
        async_to_sync(channel_layer.group_send)(
            player.token_notify,
            {
                'type' : 'game_accepted',
                'room_name' : room_name
            }
        )
    return Response({'success': SUCCESS[4]})