from .cases import ERROR_MSG, SUCCESS_MSG
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from register.models import Register
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
def verify_2FA(request):
    try:
        user_id = int(request.data.get('user_id'))
        code = int(request.data.get('code'))
    except:
        return Response({'error': ERROR_MSG['7']}, status=404)
    account = Register.objects.get(id=user_id)
    if account.SECURE.status == 'pending' and code == account.SECURE.code:
        try:
            refresh = RefreshToken.for_user(account)
            access_token = str(refresh.access_token)
            return Response({'access': access_token, 'refresh': str(refresh),}, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
               
    return Response({'error': ERROR_MSG['5']}, status=404)