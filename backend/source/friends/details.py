from django.db.models import Q
from register.models import Register
from .cases import ERROR_MSG, SUCCESS_MSG
from rest_framework.response import Response
from .models import REQUEST, FRIENDS, BLOCKER
from .tools import get_user, re
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def friend_status(request_id):
    account = request_id.user
    
    reciver_user = request_id.GET.get('username')
    client, error = get_user(reciver_user)
    if error:
        return Response({'error': error}, status=404)
    if client == account:
        return Response({'error' : ERROR_MSG['10']}, status=400)
    information = {
        'invite_me' : False,
        'on_request' : False,
        'is_friends' : False,
        'is_blocked' : False,
        'blocked_by' : None,
    }
    open_request = REQUEST.objects.filter(Q(sender=client, reciver=account) | Q(sender=account, reciver=client)).first()
    if open_request:
        if open_request.sender == account:
            information['on_request'] = True
        else:
            information['invite_me'] = True
    else:
        is_friends = FRIENDS.objects.filter(Q(account=account, friends=client) | Q(account=client, friends=account)).first()
        if is_friends:
            information['is_friends'] = True
    already = BLOCKER.objects.filter(Q(blocker=account, blocked=client) | Q(blocker=client, blocked=account)).first()
    if already:
        information['is_blocked'] = True
        information['blocked_by'] = account.username if already.blocker == account else client.username

    return Response({'success': information}, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_query(request):
    account = request.user
    
    username = request.GET.get('username')
    if not username:
        return Response({'error': ERROR_MSG['3']}, status=400)
    if not re.match(r'^[a-z0-9_]+$', username):
        return Response({'error': ERROR_MSG['2']}, status=400)
    users = Register.objects.filter(username__startswith=username).exclude(id=account.id)[:10]
    if not users:
        return Response({'error': ERROR_MSG['1']}, status=404)
    queryset = []
    for user in users:
        information = {
            'username': user.username,
            'picture': user.photo_url,
            'full_name': f'{user.first_name} {user.last_name}',
        }
        queryset.append(information)
    return Response({'success': queryset}, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def query_friends(request):
    account = request.user
    
    _friends = FRIENDS.objects.filter(Q(account=account) | Q(friends=account))
    if not _friends:
        return Response({'vide': True}, status=200)
    data = []
    for end in _friends:
        friend = end.account if end.account != account else end.friends
        information = {
            'full_name' : f"{friend.first_name} {friend.last_name}",
            'username' : friend.username,
            'picture' : friend.photo_url,
        }
        data.append(information)
    
    list_block = BLOCKER.objects.filter(Q(blocker=account) | Q(blocked=account))
    if list_block:
        for users in list_block:
            information = {
                'full_name' : f"{users.first_name} {users.last_name}",
                'username' : users.username,
                'picture' : users.photo_url,
                'is_blocked' : True,
            }
            information['blocked_by'] = account.username if users.blocker == account else users.username
            data.append(information)

    return Response({'vide' : False, 'information' : data}, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def query_invitations(request):
    account = request.user
    
    open_request = REQUEST.objects.filter(Q(reciver=account) | Q(sender=account))
    if not open_request:
        return Response({'vide': True}, status=200)
    data = []
    for inv in open_request:
        if inv.reciver != account:
            continue
        invitations = inv.sender

        information = {
            'full_name' : f"{invitations.first_name} {invitations.last_name}",
            'username' : invitations.username,
            'picture' : invitations.photo_url,
        }
        data.append(information)
    return Response({'vide' : False, 'information' : data}, status=200) 
