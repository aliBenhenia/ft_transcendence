from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from .models import Register, Profile_Security, Profile
from friends.models import FriendsList, FriendsRequest
from server_api import settings
from .profile import Send_OTP
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
import secrets , string
from .reset import Security

##################################  [OK] ##################################

def generate_token(length=32):
    return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(length))

def RespnseHeader(msg, key):
    response = JsonResponse({'message': msg}, status=key)
    #response['Access-Control-Allow-Origin'] = settings.SHARE_HOST
    return response

# [OK]

@api_view(['GET'])
def FindAccount(request, username):
    try:
        obj = Register.objects.get(username=username)
        if obj.username == username:
            return JsonResponse({'success': 'Account Found !'}, status=200)
    except:
        try:
            obj = Register.objects.get(email=username)
            if obj.email == username:
                return JsonResponse({'success': 'Account Found !'}, status=200)
        except:
            pass
        pass
    return JsonResponse({'error': 'Account Not Found !'}, status=404)


# [OK]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def FindMe(request):
    username = request.user.username
    return JsonResponse({'username': username}, status=200)

# [OK]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def AccountDetails(request, username):
    Account = {}
    try:
        obj = Register.objects.get(username=username)
        user_profile = Profile.objects.get(client=obj)

        Account['id'] = obj.id
        Account['full_name'] = obj.first_name + " " + obj.last_name
        Account['username'] = obj.username
        Account['picture'] = 'http://127.0.0.1:9000/users' + user_profile.avatar.url
        Account['win'] = user_profile.win
        Account['loss'] = user_profile.loss
        Account['level'] = user_profile.level
        Account['acheivements'] = user_profile.achievements
        Account['matches'] = user_profile.t_match

    except:
        return JsonResponse({'error': 'Account Not Found'}, status=404)

    return JsonResponse(Account, status=200)

# [OK]

def RegisterAttributes(dictionary):
    client_email = dictionary['email']
    client_fname = dictionary['first_name']
    client_lname =  dictionary['last_name']
    client_pass = dictionary['password']
    client_repass = dictionary['repassword']
    client_user = dictionary['username']

    return client_email, client_fname, client_lname, client_pass, client_repass, client_user

# [OK]

@csrf_exempt
def register(request):
    if request.method == 'POST':

        try:
            print(f"Received POST data: {request.POST.dict()}")
            dictionary = request.POST.dict()

            if dictionary['password'] != dictionary['repassword']:
                return RespnseHeader('Password Not Match', 400)
            
            try:
                checking = Register.objects.filter(username=dictionary['username'])
                if checking:
                    print('checking : True')
                
                client_object = Register.objects.create_user(
                    email=dictionary['email'],
                    first_name=dictionary['first_name'],
                    last_name= dictionary['last_name'],
                    password=dictionary['password'],
                    username=dictionary['username'],
                    token_game= generate_token(32),
                    token_notify= generate_token(32),
                    token_chat= generate_token(32),
                    activate_token = generate_token(64),
                )

                friend_list = FriendsList.objects.create()
                client_security = Profile_Security.objects.create()
                
                secure = Security.objects.create(client=client_object)
                secure.save()

                profile = Profile.objects.create()

                profile.client = client_object
                profile.secutity = client_security
                profile.list = friend_list
            
                profile.save()

                url_activate = 'http://127.0.0.1:9000/users/account-activate/' + client_object.activate_token + '/'
                print('[Activate] : ', url_activate)
                return RespnseHeader('User registered successfully', 201)
            except Exception as e:
                return RespnseHeader('[1] Something goes wrong, try again !', 400)
                      
        except:
            return RespnseHeader('[2] Something goes wrong, try again !', 400)
    else:
        return RespnseHeader('Method not allowed', 405)

# [OK]

def encrypt_mail(email):
    if '@' in email:
        parts = email.split('@')
        local_part = parts[0]
        domain_part = parts[1]
        
        visible_part = ''
        i = len(local_part)
        visible_part += local_part[0]
        for n in range(1, i - 1):
            visible_part += '*'
        visible_part += local_part[i - 1]

    return visible_part + '@' + domain_part

# [OK]

class C_TokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):

        try:
            obj = Register.objects.get(username=request.data['email'])
            request.data['email'] = obj.email
        except:
            pass
            
        response = super().post(request, *args, **kwargs)
        #response['Access-Control-Allow-Origin'] = settings.SHARE_HOST

        print('[*] Status Code : ', response.status_code)
        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

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
            client_email = request.data.get('email')
            record = Register.objects.get(email=client_email)
            profile = Profile.objects.get(client=record)

            print('[*] Protection : ', profile.secutity.otp)
            if profile.secutity.otp:
                Send_OTP(profile)
                profile.secutity.OnLogin(True)

        return response

# [OK]

def welcome(request):
    return HttpResponse('API ')

'''
from .tasks import use
    use.delay()
'''
# [OK]

def index(request):
    

    return HttpResponse('<h1>Welcome !</h1>')
