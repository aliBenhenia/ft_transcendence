from .show import onView
from .giveup import OnGiveUP
from .join import lookupSpace
from .quite import HandleQuite
from .history import GetHistory
from .cases import ERROR, SUCCESS
from friends.tools import is_twofactor
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

# GIVE UP FROM MATCH
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def random_giveup(request):
    account = request.user
    if is_twofactor(account):
        return Response({'error' : ERROR[1], '2FA' : True}, status=401)
    try:
        RoomId = int(request.data.get("room"))
        if not RoomId > 0:
            return Response({'error' : ERROR[3]}, status=404)
    except:
        return Response({'error' : ERROR[3]}, status=404)
    state = OnGiveUP(account, RoomId)
    if not state:
        return Response({'error' : ERROR[3]}, status=403)
    return Response({'success' : 'Good Luck Next Match !'}, status=200)

# PARTICIATE IN RANDOM COMPITITION
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def random_join(request):
    account = request.user
    if is_twofactor(account):
        return Response({'error' : ERROR[1], '2FA' : True}, status=401)
    
    state = lookupSpace(account)
    if not state:
        return Response({'error' : ERROR[2]}, status=403)
    return Response({'success' : SUCCESS[1]}, status=200)

# SHOW HISTORY COMPITITION
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def random_history(request):
    account = request.user
    if is_twofactor(account):
        return Response({'error' : ERROR[1], '2FA' : True}, status=401)
    state, fetch = GetHistory(account)
    if not state:
        return Response({'vide' : True}, status=200)
    return Response({'success' : fetch}, status=200)

# EXIT COMPITITION
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def random_exit(request):
    account = request.user
    if is_twofactor(account):
        return Response({'error' : ERROR[1], '2FA' : True}, status=401)
    try:
        RoomId = int(request.data.get("room"))
        if not RoomId > 0:
            return Response({'error' : ERROR[3]}, status=404)
    except:
         return Response({'error' : ERROR[3]}, status=404)

    state = HandleQuite(account, RoomId)
    if isinstance(state, str) or not isinstance(state, bool):
        return Response({'error' : ERROR[3]}, status=404)
    if not state:
        return Response({'error' : ERROR[4]}, status=403)
    return Response({'success' : SUCCESS[2]}, status=200)

# VIEW COMPITITION
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def random_view(request):
    account = request.user
    if is_twofactor(account):
        return Response({'error' : ERROR[1], '2FA' : True}, status=401)
    state, information = onView(account)
    if not state:
        return Response({'error' : {'Try to join a competition before this action!'}}, status=403)
    return Response({'success' : information}, status=200)
