from django.db.models import Q
from register.models import Register
from asgiref.sync import async_to_sync
from .cases import ERROR_MSG, SUCCESS_MSG
from rest_framework.response import Response
from channels.layers import get_channel_layer
from .models import REQUEST, FRIENDS, BLOCKER
from notification.tools import create_notification
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .tools import get_user, re, on_block, is_twofactor, is_blocked

def make_notification(sender, reciver, subject):
    notify = create_notification(sender, reciver, subject)

    if not notify:
        return False
    channel_layer = get_channel_layer()
    notification_data =  {
        'type': 'broadcast',
        'case': notify.content,
        'time' : str(notify.time),
        'sender' : sender.username,
        'picture' : str(sender.photo_url),
        'full-name' : f"{sender.first_name} {sender.last_name}",
    }
    async_to_sync(channel_layer.group_send)(reciver.token_notify,notification_data)
    return True

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def account_request(request_id):
    account = request_id.user
    if is_twofactor(account):
        return Response({'error' : ERROR_MSG['15'], '2FA' : True}, status=401)

    INFO = request_id.data
    reciver_user = INFO.get('username')
    client, error = get_user(reciver_user)
    if error:
        return Response({'error': error}, status=404)
    if client == account:
        return Response({'error' : ERROR_MSG['4']}, status=400)
    open_request = REQUEST.objects.filter(Q(sender=client, reciver=account) | Q(sender=account, reciver=client)).first()
    if open_request:
        if open_request.sender == account:
            return Response({'error' : ERROR_MSG['5']}, status=400)
        else:
            return Response({'error' : ERROR_MSG['6']}, status=400)
        
    is_friends = FRIENDS.objects.filter(Q(account=account, friends=client) | Q(account=client, friends=account)).exists()
    if is_friends:
        is_blk, option = is_blocked(account, client)
        if is_blk:
            if option:
                return Response({'error': ERROR_MSG["19"]}, status=400)
            else:
                return Response({'error': ERROR_MSG["20"]}, status=400)
        return Response({'error' : ERROR_MSG['13']}, status=400)
    
    new_request = REQUEST.objects.create(sender=account, reciver=client)
    new_request.save()
    make_notification(account, client, 'INVITATION')
    return Response({'success': SUCCESS_MSG['1']}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_accept(request_id):
    account = request_id.user
    if is_twofactor(account):
        return Response({'error' : ERROR_MSG['15'], '2FA' : True}, status=401)
    INFO = request_id.data
    reciver_user = INFO.get('username')
    client, error = get_user(reciver_user)
    if error:
        return Response({'error': error}, status=404)
    if client == account:
        return Response({'error' : ERROR_MSG['7']}, status=400)
    
    is_friends = FRIENDS.objects.filter(Q(account=account, friends=client) | Q(account=client, friends=account)).exists()
    if is_friends:
        is_blk, option = is_blocked(account, client)
        if is_blk:
            if option:
                return Response({'error': ERROR_MSG["19"]}, status=400)
            else:
                return Response({'error': ERROR_MSG["20"]}, status=400)
        return Response({'error' : ERROR_MSG['14']}, status=400)

    open_request = REQUEST.objects.filter(Q(sender=client, reciver=account) | Q(sender=account, reciver=client)).first()
    if open_request:
        if open_request.sender == account:
            return Response({'error' : ERROR_MSG['8']}, status=400)
        open_request.delete()
        accept_request = FRIENDS.objects.create(account=account, friends=client)
        accept_request.save()
        make_notification(account, client, 'ACCEPT')
        return Response({'success': SUCCESS_MSG['2']}, status=200)
    return Response({'error' : ERROR_MSG['12']}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_decline(request_id):
    account = request_id.user
    if is_twofactor(account):
        return Response({'error' : ERROR_MSG['15'], '2FA' : True}, status=401)
    INFO = request_id.data
    reciver_user = INFO.get('username')
    client, error = get_user(reciver_user)
    if error:
        return Response({'error': error}, status=404)
    if client == account:
        return Response({'error' : ERROR_MSG['9']}, status=400)
    open_request = REQUEST.objects.filter(Q(sender=client, reciver=account) | Q(sender=account, reciver=client)).first()
    if open_request:
        open_request.delete()
        make_notification(account, client, 'DECLINE')
        return Response({'success': SUCCESS_MSG['3']}, status=200)
    is_blk, option = is_blocked(account, client)
    if is_blk:
        if option:
            return Response({'error': ERROR_MSG["19"]}, status=400)
        else:
            return Response({'error': ERROR_MSG["20"]}, status=400)
    return Response({'error': ERROR_MSG['11']}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def friend_remove(request_id):
    account = request_id.user
    if is_twofactor(account):
        return Response({'error' : ERROR_MSG['15'], '2FA' : True}, status=401)
    INFO = request_id.data
    reciver_user = INFO.get('username')
    client, error = get_user(reciver_user)
    if error:
        return Response({'error': error}, status=404)
    if client == account:
        return Response({'error' : ERROR_MSG['11']}, status=400)
    is_friends = FRIENDS.objects.filter(Q(account=account, friends=client) | Q(account=client, friends=account)).first()
    if is_friends:
        is_friends.delete()
        make_notification(account, client, 'UNFRIEND')
        return Response({'success': SUCCESS_MSG['4']}, status=200)
    return Response({'error' : ERROR_MSG['11']}, status=400)

    