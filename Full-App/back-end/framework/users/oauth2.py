from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from server_api import settings
from .views import Send_OTP
import urllib.parse, secrets, string, json, requests
from django.http import JsonResponse
from .models import Register, Profile, Profile_Security, FriendsList
from rest_framework.decorators import api_view


# Generate Token
def generate_token(length=64):
    return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(length))

# Generate Authorize URL
def oauth2_login(request):
    oauth2_config = settings.OAUTH2_CONFIG
    params = {
        'client_id': oauth2_config['client_id'],
        'redirect_uri': oauth2_config['redirect_uri'],
        'response_type': 'code',
        'scope': oauth2_config['scope'],
        'state': generate_token(length=64),
    }
    auth_url = f"{oauth2_config['authorize_url']}?{urllib.parse.urlencode(params)}"
    return JsonResponse({'autorize_link' : auth_url}, status=200)


# CallBack After Agree on Permission
@api_view(['GET'])
def onCallBack(request):
    code = request.GET.get('code')
    state = request.GET.get('state')

    if not code or not state:
        return JsonResponse({'error': 'Missing code or state parameters'}, status=400)

    oauth2_config = settings.OAUTH2_CONFIG

    data = {
        'grant_type': 'authorization_code',
        'client_id': oauth2_config['client_id'],
        'client_secret': oauth2_config['client_secret'],
        'code': code,
        'redirect_uri': oauth2_config['redirect_uri'],
    }

    try:
        print('[+] token_url : ', oauth2_config['token_url'])
        response = requests.post(oauth2_config['token_url'], data=data)
        
        response.raise_for_status()  # Raise exception for bad status codes
        response_data = response.json()
        print('[+] info : ', response_data)
    except requests.exceptions.RequestException as e:
        print('[Error] Request failed: ', e)
        return JsonResponse({'error': 'Failed to retrieve access token'}, status=500)

    access_token = response_data.get('access_token')
    if not access_token:
        return JsonResponse({'error': 'No access token returned'}, status=400)

    stable, on_details = make_api_call(access_token)
    if not stable:
        return JsonResponse({'error': 'Invalid Token!'}, status=400)

    try:
        option, oauth = CreateUserOption(on_details)
        if option is None:
            return JsonResponse({'error': 'Email or Username Already Exists!'}, status=400)

        if option is False and oauth is not None:
            return ConnectToApplication(oauth)

        if option is False and oauth is None:
            return ConnectToApplication(CreateAccount(on_details, state))

        if option is True and oauth:
            return ConnectToApplication(CreateAccount(on_details, state))

    except Exception as e:
        print('[Exception]: ', e)
        return JsonResponse({'error': 'Processing Information Failed!'}, status=500)

    return JsonResponse({'error': 'Unknown Error Occurred'}, status=500)


# Return Access JWT TOKEN
def ConnectToApplication(oauth):

    refresh = RefreshToken.for_user(oauth)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    response = Response({
        'access': access_token,
        'refresh': refresh_token,
    }, status=200)
        
    response.set_cookie(
        settings.AUTH_COOKIE, access_token,
        max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
        path=settings.AUTH_COOKIE_PATH,
        secure=settings.AUTH_COOKIE_SECURE,
        httponly=settings.AUTH_COOKIE_HTTP_ONLY,
        samesite=settings.AUTH_COOKIE_SAMESITE
    )

    response.set_cookie(
        'refresh', refresh_token,
        max_age=settings.AUTH_COOKIE_REFRESH_MAX_AGE,
        path=settings.AUTH_COOKIE_PATH,
        secure=settings.AUTH_COOKIE_SECURE,
        httponly=settings.AUTH_COOKIE_HTTP_ONLY,
        samesite=settings.AUTH_COOKIE_SAMESITE
    )
    profile = Profile.objects.get(client=oauth)

    print('[*] Protection : ', profile.secutity.otp)
    if profile.secutity.otp :
        Send_OTP(profile)
        profile.secutity.OnLogin(True)

    return response

# Create User In The DB
def CreateAccount(dictionary, state):

    if state:
        dictionary['login'] = GenerateIfExit(dictionary['login'])
    client_object = Register.objects.create_user(
        email=dictionary['email'],
        first_name=dictionary['first_name'],
        last_name= dictionary['last_name'],
        username=dictionary['login'],
        token_game= generate_token(32),
        token_notify=generate_token(32),
        token_chat=generate_token(32),
        password=generate_token(40),
        account= '42',
    )

    client_object.is_active = True

    friend_list = FriendsList.objects.create()
    client_security = Profile_Security.objects.create()

    profile = Profile.objects.create()
    try:
        profile.url_picture = dictionary['image']['link']
    except:
        pass
    profile.client = client_object
    client_object.save()
    profile.secutity = client_security
    profile.list = friend_list
    profile.save()

    return client_object


# Check If the Username or Email Exist
def TaskAnlyze(username, email, state, obj):
    try:
        if state == 1:
            obj = Register.objects.get(email=email)
            if obj.email == email:
                return True, obj
        if state == 2:
            obj = Register.objects.get(username=username)
            if obj.username == username:
                return True, obj
    except:
        return False, None
    return False, None

# Call API and Check The User Details
def make_api_call(access_token):

    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    try:
        api_url = 'https://api.intra.42.fr/v2/me'
        response = requests.get(api_url, headers=headers)
        user_data = response.json()
        if user_data['login']:
            return True, user_data
    except:
        pass
    return False, None

# generate a username
def GenerateIfExit(existlogin):
    state = True
    while state == True:
        generated = f'{existlogin}' + generate_token(10)
        state, obj = TaskAnlyze(generated, None, 2, None)
    return generated

# Create and Save User Info in The DB or Not
def CreateUserOption(user_data):

    login = user_data['login']
    mail = user_data['email']

    mail_exist, ob1 = TaskAnlyze(mail , None, 1, None)
    username_exist, ob2 = TaskAnlyze(login , None, 2, None)

    if mail_exist and ob1.account == '42' or username_exist and ob2.account == '42':
        return False, ob1 if mail_exist else ob2
    if mail_exist:
        return None, None
    if username_exist:
        return False, None
    return True, None

