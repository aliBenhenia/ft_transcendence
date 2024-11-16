from rest_framework.permissions import IsAuthenticated
from .models import Register, Profile_Security, Profile
from rest_framework.views import APIView
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from server_api import settings
from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth.hashers import check_password
import random

def RespnseHeader(dictionary, key):
    response = JsonResponse(dictionary, status=key)
    #response['Access-Control-Allow-Origin'] = settings.SHARE_HOST
    return response

class UpdatePassword(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return RespnseHeader({'error': 'Incorrect old password.'}, 400)

        user.set_password(new_password)
        user.save()

        return RespnseHeader({'success': 'Password updated successfully.'}, 200)

def Send_OTP(profile):
    code = random.randint(100000, 999999)
    profile.secutity.code_2fa = code
    profile.secutity.save()

    print('CODE : [', code, ']')


class ProfileUpdate(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data

        record = get_object_or_404(Register, email=user.email)
        profile = get_object_or_404(Profile, client=record)

        if 'avatar' in data:
            profile.avatar = data.get('avatar')
        if 'first_name' in data:
            if not data.get('first_name').isalpha(): 
                return JsonResponse({'error': ' Only (A-Z) or (a-z)'}, status=400)
            user.first_name = data.get('first_name')
        if 'last_name' in data:
            if not data.get('last_name').isalpha():
                return JsonResponse({'error': ' Only (A-Z) or (a-z)'}, status=400)
            user.last_name = data.get('last_name')
        if 'password' in data:
            old_password = data.get('old_password')
            if not old_password or not check_password(old_password, user.password):
                return JsonResponse({'error': 'Old password is incorrect!'}, status=400)
            re_password = data.get('re_password')
            if not re_password:
                return JsonResponse({'error': 'Repassword is required!'}, status=400)
            if re_password != data.get('password'):
                return JsonResponse({'error': 'Passwords do not match!'}, status=400)
            user.set_password(data.get('password'))
        profile.save()
        user.save()
        return JsonResponse({'success': 'Account updated successfully!'}, status=200)

class OTP_Update(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
    
        record = get_object_or_404(Register, email=user.email)
        profile = get_object_or_404(Profile, client=record)
        otp_status = request.data.get('status')
        print('[*] Status : ', otp_status)
        if otp_status == True:
            profile.secutity.OTP(True)
        else:
            profile.secutity.OTP(False)
        return RespnseHeader({'success': 'otp updated successfully.'}, 200)


class OTPView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        record = Register.objects.get(email=user)
        profile = Profile.objects.get(client=record)
        if profile.secutity.on_login == False:
            return Response({'message': 'OTP is Already Verified.'}, status=200)
        else:
            print('[*] Limit [' , profile.secutity.retry_later , ']')
            if profile.secutity.next_retry_time != None:
                print('[*] Next Rerty [' , profile.secutity.next_retry_time , ']')
            if profile.secutity.verify_retry():
                if profile.secutity.can_retry_otp() == False:
                    return Response({'error': 'You have reached the limit. Please try again after one hour.'}, status=429)
            Send_OTP(profile)
        return Response({'message': 'OTP has been sent to your email.'}, status=200)

    def post(self, request):
        user = request.user
        record = Register.objects.get(email=user)
        profile = Profile.objects.get(client=record)
        print('[*] ENTER HERE ')
        if profile.secutity.on_login == False:
            return RespnseHeader({'message': 'OTP is Already Verified.'}, 200)
        if '2fa' in request.data:
            verify_code = request.data['2fa']
            print('[*] verify_code : ', verify_code)
            print('[*] verify_code type : ', type(verify_code))
            if profile.secutity.verify_otp(int(verify_code)):
                profile.secutity.otp_completed()
                return RespnseHeader({'message': 'Verification Completed !'}, 200)
        return RespnseHeader({'error': 'Invalid OTP.'}, 400)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        dictionary = {}
        user = request.user
        record = Register.objects.get(email=user)
        profile = Profile.objects.get(client=record)

        # Security Info
        dictionary['otp'] = profile.secutity.otp
        if profile.secutity.on_login:
            dictionary['message'] = 'Verification is Require !'
            return RespnseHeader(dictionary, status.HTTP_401_UNAUTHORIZED)

        # Profile Info
        dictionary['email'] = record.email
        dictionary['first_name'] = record.first_name
        dictionary['last_name'] = record.last_name

        # Game Info
        #if user.account == '42':
        print('[>>] : ', profile.avatar.url)
        dictionary['avatar'] = profile.avatar.url
        dictionary['win'] = profile.win
        dictionary['loss'] = profile.loss
        dictionary['level'] = profile.level
        dictionary['acheivements'] = profile.achievements
        dictionary['matches'] = profile.t_match

        return RespnseHeader(dictionary, 200)

    def post(self, request):
        user = request.user
        record = get_object_or_404(Register, email=user.email)
        profile = get_object_or_404(Profile, client=record)

        if 'avatar' in request.data:
            profile.avatar = request.data['avatar']
            profile.save()
            return Response({"message": "Profile image updated successfully"}, status=200)
        else:
            return Response({"error": "No image provided"}, status=400)
    

class LogoutView(APIView):

    def post(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie(settings.AUTH_COOKIE)
        response.delete_cookie('refresh')

        return response