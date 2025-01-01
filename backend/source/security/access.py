from .cases import ERROR_MSG, SUCCESS_MSG
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def send_2FA(request):
    SECURITY = request.user.SECURE
    if SECURITY.processing(True):
        no_wait, time = SECURITY.can_retry(True)
        if not no_wait:
            return Response({"error": ERROR_MSG['2'], "time" : time}, status=429)
        SECURITY.send_code(False)
        SECURITY.processing(True)
    else:
        SECURITY.send_code(False)
    return Response({"success": SUCCESS_MSG['4']}, status=200)

@api_view(['POST'])
def verify_2FA(request):
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        code = int(request.data.get('code'))
    except:
        return Response({'error': ERROR_MSG['7']}, status=404)
    account = authenticate(request, username=email, password=password)
    session_data = request.session.get(str(account.id))
    if session_data and session_data['2fa'] == '2fa_pending':
        if code == int(session_data['code']):
            token_serializer = TokenObtainPairSerializer(data={'email': request.data.get('email'), 'password': request.data.get('password')})
            if token_serializer.is_valid():
                del request.session[str(account.id)]
                return Response(token_serializer.validated_data, status=200)
    return Response({'error': ERROR_MSG['5']}, status=404)