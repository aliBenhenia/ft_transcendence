import json, requests
from security.tools import AccountLookup
from register.models import generate_token
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
import random
from server.settings import EMAIL_HOST_USER

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

def send_email(recipient, subject, message):
    subject = str(subject)
    message = str(message)
    sender = EMAIL_HOST_USER
    recipient_list = []
    recipient_list.append(recipient)
    try:
        send_mail(subject, message, sender, recipient_list)
    except Exception as e:
        print(f"{e}")

def generate_code():
    otp = random.randint(100000, 999999)
    return otp