from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Register, RegisterException
from .error import ALL_CASSES 
from rest_framework.decorators import api_view
import requests
from server import settings
from rest_framework_simplejwt.tokens import RefreshToken
import uuid
from datetime import timedelta
import random

class RegisterAccount(APIView):
    
    permission_classes = [AllowAny]

    def post(self, request):

        try:
            obj = Register.objects.create_user(request.data)
        except Exception as e:
            error_case = str(e)
            print(error_case)
            if error_case in ALL_CASSES:
                default_status = 400 if error_case != "7" and error_case != "13" else 409
                return Response({'error': ALL_CASSES[error_case]}, status=default_status)
            return Response({'error':'Invalid Information Try Again With Valid Information!'}, status=400)
        return Response({'success':'Your account has been successfully created!'}, status=201)

@api_view(['POST'])
def intra_register(request):
    code = request.data.get('code')
    if not code:
        return Response({'error': 'Authorization code is missing'}, status=400)
    token_url = 'https://api.intra.42.fr/oauth/token'
    api_url = "https://api.intra.42.fr/v2/me"
    data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': settings.OAUTH_REDIRECT_URI,
        'client_id': settings.OAUTH_CLIENT_ID, 
        'client_secret': settings.OAUTH_CLIENT_SECRET,
    }
    response = requests.post(token_url, data=data)
    if response.status_code == 200:
        token_data = response.json()
        access_token = token_data.get('access_token')
        response = requests.get(api_url, headers={"Authorization": f"Bearer {access_token}"})
        if response.status_code == 200:
            user_data = response.json()
            user = Register.objects.filter(provider_id=user_data['id']).first()
            if user :
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                return Response({'access': access_token, 'refresh': str(refresh),}, status=200)
            else:
                if Register.objects.filter(email=user_data['email']).first():
                    return Response({'error', 'Email already associated with an account.'})
                password = uuid.uuid4().hex
                random_numbers = ''.join([str(random.randint(0, 9)) for _ in range(4)])
                generated_username = user_data.get('login') + random_numbers
                data_to_save = {
                    'provider_id' : int(user_data.get('id')),
                    'username' : generated_username,
                    'first_name': user_data.get('first_name'),
                    'last_name': user_data.get('last_name'),
                    'email': user_data.get('email'),
                    'photo_url': str(user_data['image']['link']),
                    'password' : password,
                    'repassword' : password,
                }
                #
                new_user = Register.objects.create_user(data_to_save)
                refresh = RefreshToken.for_user(new_user)
                access_token = str(refresh.access_token)
                return Response({'access': access_token, 'refresh': str(refresh),}, status=200)
    return Response({'error' : ''}, status=404)