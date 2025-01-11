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
from .tools import get_user, re, on_block, is_blocked

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
def account_request(request):
    account = request.user
    data = request.data
    account_to_send_to = data.get('username', None)
    account_to_send_to, error = get_user(account_to_send_to)
    if error:
        return Response({'error': error}, status=404)
    if account_to_send_to == account:
        return Response({'error' : 'cannot send friend request'}, status=400)
    
    blocked, option = is_blocked(account, account_to_send_to)
    if blocked:
        if option:
            return Response({'error': ERROR_MSG["19"]}, status=400)
        else:
            return Response({'error': ERROR_MSG["20"]}, status=400)

    is_friends = FRIENDS.objects.filter(Q(account=account, friends=account_to_send_to) | Q(account=account_to_send_to, friends=account)).exists()
    if is_friends:
        return Response({'error' : ERROR_MSG['13']}, status=400)

    open_request = REQUEST.objects.filter(Q(sender=account_to_send_to, reciver=account) | Q(sender=account, reciver=account_to_send_to)).first()
    if open_request:
        if open_request.sender == account:
            return Response({'error' : ERROR_MSG['5']}, status=400)
        else:
            return Response({'error' : ERROR_MSG['6']}, status=400)
    
    REQUEST.objects.create(sender=account, reciver=account_to_send_to)
    make_notification(account, account_to_send_to, 'INVITATION')
    return Response({'success': SUCCESS_MSG['1']}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_accept(request):
    account = request.user
    data = request.data
    receiver = data.get('username', None)
    receiver, error = get_user(receiver)
    if error:
        return Response({'error': error}, status=404)

    if receiver == account:
        return Response({'error' : ERROR_MSG['7']}, status=400)
    
    is_friends = FRIENDS.objects.filter(Q(account=account, friends=receiver) | Q(account=receiver, friends=account)).exists()
    if is_friends:
        return Response({'error' : ERROR_MSG['14']}, status=400)

    open_request = REQUEST.objects.filter(Q(sender=receiver, reciver=account) | Q(sender=account, reciver=receiver)).first()
    if open_request:
        # if open_request.sender == account:
        #     return Response({'error' : ERROR_MSG['8']}, status=400)
        open_request.delete()
        FRIENDS.objects.create(account=account, friends=receiver)
        make_notification(account, receiver, 'ACCEPT')
        return Response({'success': SUCCESS_MSG['2']}, status=200)
    return Response({'error' : ERROR_MSG['12']}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_decline(request):
    account = request.user
    data = request.data
    receiver = data.get('username')
    receiver, error = get_user(receiver)

    if error:
        return Response({'error': error}, status=404)

    if receiver == account:
        return Response({'error' : ERROR_MSG['9']}, status=400)
    open_request = REQUEST.objects.filter(Q(sender=receiver, reciver=account) | Q(sender=account, reciver=receiver)).first()
    if open_request:
        open_request.delete()
        make_notification(account, receiver, 'DECLINE')
        return Response({'success': SUCCESS_MSG['3']}, status=200)
    return Response({'error': ERROR_MSG['11']}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def friend_remove(request):
    account = request.user
    data = request.data
    receiver = data.get('username')
    receiver, error = get_user(receiver)
    if error:
        return Response({'error': error}, status=404)
    if receiver == account:
        return Response({'error' : ERROR_MSG['11']}, status=400)
    is_friends = FRIENDS.objects.filter(Q(account=account, friends=receiver) | Q(account=receiver, friends=account)).first()
    if is_friends:
        is_friends.delete()
        make_notification(account, receiver, 'UNFRIEND')
        return Response({'success': SUCCESS_MSG['4']}, status=200)
    return Response({'error' : ERROR_MSG['11']}, status=400)
