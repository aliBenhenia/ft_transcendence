from django.db.models import Q
from .models import FRIENDS, BLOCKER
from .cases import ERROR_MSG, SUCCESS_MSG
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .tools import get_user, re, on_block
from rest_framework.decorators import api_view, permission_classes

@api_view(['POST'])
@permission_classes([IsAuthenticated])
<<<<<<< HEAD
def friend_block(request_id):
    account = request_id.user

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
=======
def friend_block(request):
    account = request.user
    data = request.data
    to_block = data.get('username')
    to_block, error = get_user(to_block)
    if error:
        return Response({'error': error}, status=404)

    if to_block == account:
        return Response({'error' : ERROR_MSG['17']}, status=400)
    is_friends = FRIENDS.objects.filter(Q(account=account, friends=to_block) | Q(account=to_block, friends=account)).first()
    if is_friends:
        useless, state = on_block(account, to_block)
        if state:
            return Response({'error' : ERROR_MSG['16']}, status=400)
        # is_friends.delete()
>>>>>>> origin/main
        return Response({'success': SUCCESS_MSG['5']}, status=200)
    return Response({'error' : ERROR_MSG['11']}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
<<<<<<< HEAD
def friend_unblock(request_id):
    account = request_id.user
    
    INFO = request_id.data
    reciver_user = INFO.get('username')
=======
def friend_unblock(request):
    account = request.user
    
    data = request.data
    reciver_user = data.get('username')
>>>>>>> origin/main
    client, error = get_user(reciver_user)
    if error:
        return Response({'error': error}, status=404)
    if client == account:
        return Response({'error' : ERROR_MSG['18']}, status=400)
    is_friends = FRIENDS.objects.filter(Q(account=account, friends=client) | Q(account=client, friends=account)).first()
    if is_friends:
<<<<<<< HEAD
        already = BLOCKER.objects.filter(blocker=account, blocked=client).first()
        if already:
            already.delete()
            return Response({'success': SUCCESS_MSG['6']}, status=200)
    return Response({'error' : ERROR_MSG['11']}, status=400)
=======
        blocked = BLOCKER.objects.filter(blocker=account, blocked=client).first()
        if blocked:
            blocked.delete()
            is_friends.delete()
            return Response({'success': SUCCESS_MSG['6']}, status=200)
    return Response({'error' : ERROR_MSG['11']}, status=400)
>>>>>>> origin/main
