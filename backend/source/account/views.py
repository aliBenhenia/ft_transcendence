from PIL import Image
from .achivement import ACHIEVEMENTS
from register.models import Register
from server.settings import PATH_PICTURE
from .cases import ERROR_MSG, SUCCESS_MSG
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import api_view, permission_classes
from .tools import ValidateName, ValidatePassword, get_friends_list

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def account_view(request):
    Account = request.user
    data = {
        
        # GENERAL INFO
        'id' : Account.id,
        'email' : Account.email,
        'username': Account.username,
        'online' : Account.is_online,
        'picture' : Account.photo_url,
        'full_name' : Account.first_name + ' ' + Account.last_name,
        
        # STATICS INFO
        
        'win' :  Account.DETAILS.win,
        'loss' :  Account.DETAILS.loss,
        'total_match' : Account.DETAILS.total_match,
        'last_match' : Account.DETAILS.last_match,
        'rank' : Account.DETAILS.rank,
        'level' : Account.DETAILS.level,
        'level_percentage' : Account.DETAILS.level_progress_percentage,
        'xp_total' : Account.DETAILS.xp_total,
        'achievements' : ACHIEVEMENTS[Account.DETAILS.achievements],

    }
    return Response({'informations' : data}, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def searching_view(request):
    Account = request.user
    try:
        username = request.GET.get('username')
        if not username:
            return Response({'error' : ERROR_MSG['3']}, status=400)
        TARGET = Register.objects.get(username=username)
    except:
        return Response({'error' : ERROR_MSG['2']}, status=404)
    
    data = {

        # GENERAL INFO
        'id' : TARGET.id,
        'username': TARGET.username,
        'online' : TARGET.is_online,
        'picture' : TARGET.photo_url,
        'full_name' : TARGET.first_name + ' ' + TARGET.last_name,
        
        # STATICS INFO
        
        'win' :  TARGET.DETAILS.win,
        'rank' : TARGET.DETAILS.rank,
        'loss' :  TARGET.DETAILS.loss,
        'level' : TARGET.DETAILS.level,
        'level_percentage' : TARGET.DETAILS.level_progress_percentage,
        'xp_total' : TARGET.DETAILS.xp_total,
        'total_match' : TARGET.DETAILS.total_match,
        'achievements' : ACHIEVEMENTS[TARGET.DETAILS.achievements],
    }
    return Response({'account' : data, 'details' : get_friends_list(TARGET)}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    Account = request.user
    data = request.data
    photo = data.get('picture')
    if photo:
        try:
            Image.open(photo)
        except:
            return Response({'error' : ERROR_MSG['20']}, status=400)
        Account.picture = photo
        Account.save()
        Account.photo_url = PATH_PICTURE + str(Account.picture.url)
        Account.save()
    if data.get('username', None):
        if Register.objects.filter(username=data.get('username')).first():
            return Response({'error', 'username already in use.'}, status=409)
        Account.username = data.get('username')

    if data.get('email', None):
        if Register.objects.filter(email=data.get('email')).exists():
            return Response({'error', 'email already in use'}, status=409)
        Account.email = data.get('email')

    firstname = data.get('first_name')
    lastname = data.get('last_name')
    if firstname and lastname:
        is_valid = ValidateName(firstname, True)
        if is_valid != None:
            return Response({'error' : ERROR_MSG[is_valid]}, status=400)
        is_valid = ValidateName(lastname, False)
        if is_valid != None:
            return Response({'error' : ERROR_MSG[is_valid]}, status=400)
        Account.first_name = firstname
        Account.last_name = lastname

    if firstname and not lastname:
        return Response({'error' : ERROR_MSG['8']}, status=400)
    if lastname and not firstname:
        return Response({'error' : ERROR_MSG['5']}, status=400)
    password = request.data.get('new_password')
    repassword = request.data.get('re_password')
    oldpassword = request.data.get('old_password')
    if password or repassword or oldpassword:
        ON_CHECK = ValidatePassword(password, repassword, oldpassword)
        if ON_CHECK != None:
            return Response({'error': ERROR_MSG[ON_CHECK]}, status=400)
        if not check_password(oldpassword, Account.password):
            return Response({'error': ERROR_MSG['19']}, status=400)
        if password == oldpassword:
            return Response({'error': ERROR_MSG['21']}, status=400)
        Account.set_password(password)
    Account.save()
    return Response({'success': SUCCESS_MSG['1']}, status=200)

@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def activate_2FA(request):
    account = request.user
    if request.method == 'GET':
        return Response({'success': {'2FA' : account.SECURE.activate}}, status=200)
    INFO = request.data
    state = INFO.get('status')
    if not state:
        return Response({'error': ERROR_MSG['24']}, status=400)
    if state == 'true':
        if account.SECURE.activate == False:
            account.SECURE.activate_2FA(True)
            return Response({'success': SUCCESS_MSG['2']}, status=200)
        return Response({'error': ERROR_MSG['22']}, status=400)
    elif state == 'false':
        if account.SECURE.activate == True:
            account.SECURE.activate_2FA(False)
            return Response({'success': SUCCESS_MSG['3']}, status=200)
        return Response({'error': ERROR_MSG['23']}, status=400)
    return Response({'error': ERROR_MSG['24']}, status=400)
