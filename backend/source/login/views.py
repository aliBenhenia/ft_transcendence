import urllib.parse, json, requests
from register.models import Register
# from server.settings import OAUTH2_CONFIG
from .cases import ERROR_MSG, SUCCESS_MSG
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .tools import AccountLookup, generate_token, on_ready, make_api_call, ConnectToApplication, generate_code, send_email
from django.contrib.auth import authenticate

class TokenOnLoginPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email:
            return Response({'error': ERROR_MSG[1]}, status=400)
        if not password:
            return Response({'error': ERROR_MSG[2]}, status=400)
            
        user = authenticate(request, email=email, password=password)
        if user is None:
            return Response({'error': ERROR_MSG[3]}, status=404)
        try:
            token_serializer = TokenObtainPairSerializer(data={'email': email, 'password': password})
            if token_serializer.is_valid():
                if user.SECURE.activate:
                    code  = generate_code()
                    user.SECURE.code = code
                    user.SECURE.status = 'pending'
                    user.SECURE.save()
                    send_email(user.email, code, "2FA VERIFICATION")
                    return Response({'2FA': True, 'user_id' : str(user.id)}, status=200)
                else:
                    return Response(token_serializer.validated_data, status=200)
        except:
            pass
        return Response({'error': ERROR_MSG[4]}, status=404)

