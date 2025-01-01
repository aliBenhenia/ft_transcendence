import json, requests
from security.tools import AccountLookup
from register.models import generate_token
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
import random

def on_ready(username, on_check):
    i = 1
    while on_check:
        generated = f"{username}_{generate_token(i)}".lower()
        std_generated, on_check = AccountLookup(generated)
        i += 1
    return generated.lower()

def ConnectToApplication(oauth):
    refresh = RefreshToken.for_user(oauth)
    return Response({'access': str(refresh.access_token),'refresh': str(refresh),}, status=200)

def make_api_call(access_token):

    headers = {'Authorization': f'Bearer {access_token}'}
    try:
        api_url = 'https://api.intra.42.fr/v2/me'
        response = requests.get(api_url, headers=headers)
        account = response.json()
        if account['login']:
            return True, account
    except:
        pass
    return False, None

def send_email(recipient, message):
    subject = "Test Email from Django"
    message = str(message)
    sender = "marwan.zaroual.1337.1@gmail.com"
    recipient_list = []
    recipient_list.append(recipient)
    send_mail(subject, message, sender, recipient_list)

def generate_code():
    otp = random.randint(100000, 999999)
    return otp