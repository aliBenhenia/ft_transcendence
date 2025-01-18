from PIL import Image
from .achivement import ACHIEVEMENTS
from register.models import Register, RegisterException,  RegisterManager
from register.error import ERRORS
from server.settings import PATH_PICTURE
from .cases import ERROR_MSG, SUCCESS_MSG
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import api_view, permission_classes
from .tools import get_friends_list

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
        'level' : Account.DETAILS.level,
        'level_percentage' : Account.DETAILS.level_progress_percentage,
        'xp_total' : Account.DETAILS.xp_total,
    }
    return Response({'informations' : data}, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def searching_view(request):
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
        'loss' :  TARGET.DETAILS.loss,
        'level' : TARGET.DETAILS.level,
        'level_percentage' : TARGET.DETAILS.level_progress_percentage,
        'xp_total' : TARGET.DETAILS.xp_total,
        'total_match' : TARGET.DETAILS.total_match,
    }
    return Response({'account' : data, 'details' : get_friends_list(TARGET)}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    try:
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
            Account.username = data.get('username')

        if data.get('email', None):
            Account.email = data.get('email')

        if data.get('first_name', None):
            Account.first_name = data.get('first_name', None)

        if data.get('last_name'):
            Account.last_name = data.get('last_name')

        #change password
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        re_password = request.data.get('re_password')
        if new_password or re_password or old_password:
            if new_password and re_password and old_password:
                if not old_password:
                    return Response({'error': 'Old password is required to change the password.'}, status=400)
                if not check_password(old_password, Account.password):
                    return Response({'error': 'Incorrect password'}, status=400)
                if new_password == old_password:
                    return Response({'error': 'Try with diffrent new password'}, status=400)
            else:
                return Response({'error' : 'Both current password and re-password are required'}, status=400)
        try:
            RegisterManager.ValidateRegister(request.data, False)
        except RegisterException as e:
            return Response({'error' : ERRORS[str(e)]}, status=400)
        #
        Account.set_password(new_password)
        Account.save()
        return Response({'success': SUCCESS_MSG['1']}, status=200)
        #
    except Exception as e:
        return Response({'error' : str(e)}, status=400)

@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def activate_2FA(request):
    account = request.user
    if request.method == 'GET':
        return Response({'success': {'2FA' : account.SECURE.activate}}, status=200)
    try:
        data = request.data
        state = data.get('status')
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
    except:
        return Response({'error': 'invalid format'}, status=400)
