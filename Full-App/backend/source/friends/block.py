from django.db.models import Q
from .models import FRIENDS, BLOCKER
from .cases import ERROR_MSG, SUCCESS_MSG
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .tools import get_user, is_twofactor, re, on_block
from rest_framework.decorators import api_view, permission_classes

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def friend_block(request_id):
    account = request_id.user
    if is_twofactor(account):
        return Response({'error' : ERROR_MSG['15'], '2FA' : True}, status=401)
    INFO = request_id.data
    reciver_user = INFO.get('username')
    client, error = get_user(reciver_user)
    if error:
        return Response({'error': error}, status=404)
    if client == account:
        return Response({'error' : ERROR_MSG['17']}, status=400)
    is_friends = FRIENDS.objects.filter(Q(account=account, friends=client) | Q(account=client, friends=account)).first()
    if is_friends:
        useless, state = on_block(account, client)
        if state:
            return Response({'error' : ERROR_MSG['16']}, status=400)
        return Response({'success': SUCCESS_MSG['5']}, status=200)
    return Response({'error' : ERROR_MSG['11']}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def friend_unblock(request_id):
    account = request_id.user
    if is_twofactor(account):
        return Response({'error' : ERROR_MSG['15'], '2FA' : True}, status=401)
    INFO = request_id.data
    reciver_user = INFO.get('username')
    client, error = get_user(reciver_user)
    if error:
        return Response({'error': error}, status=404)
    if client == account:
        return Response({'error' : ERROR_MSG['18']}, status=400)
    is_friends = FRIENDS.objects.filter(Q(account=account, friends=client) | Q(account=client, friends=account)).first()
    if is_friends:
        already = BLOCKER.objects.filter(blocker=account, blocked=client).first()
        if already:
            already.delete()
            
            return Response({'success': SUCCESS_MSG['6']}, status=200)
    return Response({'error' : ERROR_MSG['11']}, status=400)