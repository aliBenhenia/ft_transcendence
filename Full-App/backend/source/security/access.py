from .cases import ERROR_MSG, SUCCESS_MSG
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

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
@permission_classes([IsAuthenticated])
def verify_2FA(request):
    SECURITY = request.user.SECURE
    if SECURITY.processing(False):
        wait, time = SECURITY.can_retry(True)
        if not wait:
           return Response({"error": ERROR_MSG['2'], "time" : time}, status=429)
        SECURITY.processing(False)
    try:
        code = int(request.data.get('code'))
    except:
        return Response({'error': ERROR_MSG['7']}, status=404)

    if SECURITY.verify_otp(code):
        SECURITY.login(False)
        return Response({"success": SUCCESS_MSG['3']}, status=200)
    return Response({'error': ERROR_MSG['5']}, status=404)