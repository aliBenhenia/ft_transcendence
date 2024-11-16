from .models import NOTIFY
from .cases import ERROR_MSG, SUCCESS_MSG
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notification_view(request):
    account = request.user
    if account.SECURE.activate:
        if account.SECURE.on_login:
            return Response({'error' : ERROR_MSG['1'], '2FA' : True}, status=401)
    Notifications = account.recive_notifications.all()
    if not Notifications:
        return Response({'vide' : True, 'message': 'No notifications at the current time.'}, status=200)
    data = []
    total = 0
    for n in Notifications:
        rows = {
            'seen' : n.mark,
            'time' : n.time,
            'subject' : n.content,
            'sender' : n.sender.username,
            'picture' : n.sender.photo_url,
            'full-name' : f"{n.sender.first_name} {n.sender.last_name}",
        }
        data.append(rows)
        total += 1 if n.mark == False else 0 
    return Response({'vide' : False, 'notifications': data, 'total' : total}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def notification_mark(request):
    account = request.user
    if account.SECURE.activate:
        if account.SECURE.on_login:
            return Response({'error' : ERROR_MSG['1'], '2FA' : True}, status=401)
    Notifications = account.recive_notifications.all()
    if not Notifications:
        return Response({'vide' : True, 'message': 'No notifications at the current time !'}, status=200)
    for n in Notifications:
        n.mark_as_read()
    return Response({'message' : 'all notifications has marked as read .'}, status=200)

# "message": "all notifications has marked as read"


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def notification_delete(request):
    account = request.user
    if account.SECURE.activate:
        if account.SECURE.on_login:
            return Response({'error' : ERROR_MSG['1'], '2FA' : True}, status=401)
    Notifications = account.recive_notifications.all()
    if not Notifications:
        return Response({'vide' : True, 'message': 'No notifications at the current time !'}, status=200)
    for n in Notifications:
        n.delete()
    return Response({'message' : 'all notifications has been deleted !'}, status=200)
    

    