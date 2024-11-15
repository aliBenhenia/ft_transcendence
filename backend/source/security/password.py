from .models import SECURITY
from register.models import Register
from security.tools import AccountLookup
from .cases import ERROR_MSG, SUCCESS_MSG
from rest_framework.response import Response
from .tools import AccountLookup, ValidatePassword
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import api_view, permission_classes

@api_view(['GET'])
def find_account(request):
    account = request.GET.get('account')
    if not account:
        return Response({'error': ERROR_MSG['16']}, status=400)
    obj, state = AccountLookup(account)
    if not state:
        return Response({'error': ERROR_MSG['1']}, status=404)
    data = {
        'email' : obj.email,
        'full_name' : f"{obj.first_name} {obj.last_name}",
        'picture' : obj.photo_url,
    }
    return Response({'success': data}, status=200)


@api_view(['POST'])
def send_code(request):
    try:
        INFO = request.data
        userinfo = INFO.get('account')
        if not userinfo:
            return Response({'error': ERROR_MSG['16']}, status=404)
    except:
        return Response({'error': ERROR_MSG['16']}, status=404)
    obj, state = AccountLookup(userinfo)
    if not state:
        return Response({'error': ERROR_MSG['1']}, status=404)
    SECURITY = obj.SECURE
    if SECURITY.processing(True):
        no_wait, time = SECURITY.can_retry(False)
        if not no_wait:
            return Response({"error": ERROR_MSG['2'], "time" : time}, status=429)
        SECURITY.send_code(True)
        SECURITY.processing(True)
    else:
        SECURITY.send_code(True)
    return Response({"success": SUCCESS_MSG['1']}, status=200)

@api_view(['POST'])
def verify_code(request):
    try:
        INFO = request.data
        userinfo = INFO.get('account')
        if not userinfo:
            return Response({'error': ERROR_MSG['16']}, status=404)
    except:
        return Response({'error': ERROR_MSG['16']}, status=404)
    obj, state = AccountLookup(userinfo)
    if not state:
        return Response({'error': ERROR_MSG['1']}, status=404)
    SECURITY = obj.SECURE
    if SECURITY.processing(False):
        wait, time = SECURITY.can_retry(False)
        if not wait:
           return Response({"error": ERROR_MSG['2'], "time" : time}, status=429)
        SECURITY.processing(False)
    try:
        code = int(INFO.get('code'))
    except:
        return Response({'error': ERROR_MSG['4']}, status=404)
    if SECURITY.verify(code):
        return Response({"success": SUCCESS_MSG['2'], 'token': SECURITY.token_setup()}, status=200)
    return Response({'error': ERROR_MSG['3']}, status=404)

@api_view(['POST', 'GET'])
def token_password(request, token):
    if len(token) < 60:
        return Response({'error': ERROR_MSG['8']}, status=400)
    try:
        CHANGE = SECURITY.objects.get(token=token)
    except:
        return Response({'error': ERROR_MSG['9']}, status=404)
    if not CHANGE.verify_token():
        return Response({'error': ERROR_MSG['9']}, status=404)
    if request.method == 'GET':
        return Response({'success': SUCCESS_MSG["6"]}, status=200)
    password = request.data.get('password')
    repassword = request.data.get('repassword')
    ON_CHECK = ValidatePassword(password, repassword)
    if ON_CHECK:
        return Response({'information': ERROR_MSG[ON_CHECK]}, status=400)
    Account = Register.objects.get(SECURE=CHANGE)
    if check_password(password, Account.password):
        return Response({'error': ERROR_MSG['15']}, status=400)
    Account.set_password(password)
    CHANGE.on_state()
    Account.save()
    return Response({'success': SUCCESS_MSG["5"]}, status=200)


    









