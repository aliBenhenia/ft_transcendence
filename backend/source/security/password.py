from .models import SECURITY
from register.models import Register, RegisterManager
from security.tools import AccountLookup
from .cases import ERROR_MSG, SUCCESS_MSG
from rest_framework.response import Response
from .tools import AccountLookup, ValidatePassword
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import api_view, permission_classes

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.urls import reverse
from login.tools import send_email
from server.settings import FRONT_END_URL
from register.error import ERRORS

@api_view(['GET'])
def find_account(request):
    account = request.GET.get('account')
    if not account:
        return Response({'error': 'The "account" query parameter is required.'}, status=400)
    if Register.objects.filter(username=account).exists():
        user = Register.objects.filter(username=account).first()
    else:
        return Response({'error': ERROR_MSG['1']}, status=404)
    data = {
        'email' : user.email,
        'full_name' : f"{user.first_name} {user.last_name}",
        'picture' : user.photo_url,
    }
    return Response({'success': data}, status=200)

@api_view(['POST'])
def request_password_reset(request):
    try:
        email = request.data.get("email")
        if not email:
            return Response({'error': 'email is required'}, status=404)
        if Register.objects.filter(email=email).exists():
            user = Register.objects.filter(email=email).first()
        else:
            return Response({'error': 'User with this email does not exist.'}, status=404)

        token = PasswordResetTokenGenerator().make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        frontend_url = FRONT_END_URL
        reset_path = f"/reset-password/?uid={uid}&token={token}"
        reset_link = frontend_url + reset_path
        send_email(email, "Password reset", reset_link)
        return Response({'message': 'Password reset link sent to your email.'}, status=200)
    except:
        return Response({'error': 'Invalid request'}, status=400)

@api_view(['POST'])
def reset_password(request):
    try:
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('newPassword')
        if not uid or not token or not new_password:
            return Response({"error": "Invalid reset password request"}, status=400)
        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = Register.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, Register.DoesNotExist):
            return Response({"error": "Invalid reset link"}, status=400)

        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token"}, status=400)
        #
        try:
            RegisterManager.ValidatePassword(new_password, new_password ,True)
        except Exception as e:
            error_case = str(e)
            return Response({'error': ERRORS[error_case]}, status=400)
        user.set_password(new_password)
        user.save()

        return Response({"success": "Password reset successful"}, status=200)
    except:
        return Response({"error": "Invalid request"}, status=400)
