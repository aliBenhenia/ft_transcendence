import urllib.parse, json, requests
from register.models import Register
<<<<<<< HEAD
from server.settings import OAUTH2_CONFIG
=======
# from server.settings import OAUTH2_CONFIG
>>>>>>> origin/main
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
<<<<<<< HEAD
            print('excep')
            pass
        return Response({'error': ERROR_MSG[4]}, status=404)

@api_view(['GET'])
def oauth2_login(request):
    params = {
        'response_type': 'code',
        'scope': OAUTH2_CONFIG['scope'],
        'state': generate_token(length=64),
        'client_id': OAUTH2_CONFIG['client_id'],
        'redirect_uri': OAUTH2_CONFIG['redirect_uri'],
    }
    auth_url = f"{OAUTH2_CONFIG['authorize_url']}?{urllib.parse.urlencode(params)}"
    return Response({'autorize_link' : auth_url}, status=200)

@api_view(['GET'])
def on_callback(request):
    code = request.GET.get('code')
    if not code:
        Response({'error': ERROR_MSG[5]}, status=400)
    data = {
        'grant_type': 'authorization_code',
        'client_id': OAUTH2_CONFIG['client_id'],
        'client_secret': OAUTH2_CONFIG['client_secret'],
        'code': code,
        'redirect_uri': OAUTH2_CONFIG['redirect_uri'],
    }
    try:
        response = requests.post('https://api.intra.42.fr/oauth/token', data=data)
        print('[+] response.status_code :', response.status_code)
        ACCESS = response.json()
        if response.status_code != 200:
            return Response({'error': ERROR_MSG[5]}, status=400)
    except:
        return Response({'error': ERROR_MSG[5]}, status=400)
    access_token = ACCESS.get('access_token')
    state, details = make_api_call(access_token)
    if not state:
        return Response({'error': ERROR_MSG[5]}, status=400)
    search, state = AccountLookup(details['email'])
    if state and search.ACCOUNT == '42':
        return ConnectToApplication(search)
    if state and search.ACCOUNT != '42':
        return Response({'error': ERROR_MSG[5]}, status=400)
    is_username, on_check = AccountLookup(details['login'])
    if on_check:
        std_generated = on_ready(details['login'], True)
    try:
        pwd_generated = generate_token(15)
        info = {
            'email' : details['email'],
            'password': pwd_generated,
            'repassword': pwd_generated,
            'last_name' : details['last_name'],
            'first_name' : details['first_name'],
            'username' : details['login'] if not on_check else std_generated,
        }
        on_create = Register.objects.create_user(info)
        on_create.ACCOUNT = '42'
        on_create.photo_url = details['image']['link']
        on_create.save()
        return ConnectToApplication(on_create)
    except:
        return Response({'error': ERROR_MSG[5]}, status=400)

=======
            pass
        return Response({'error': ERROR_MSG[4]}, status=404)

>>>>>>> origin/main
