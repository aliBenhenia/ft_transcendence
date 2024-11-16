from .models import Register
from rest_framework import status
from .reset import Security
from django.http import JsonResponse
from .oauth2 import ConnectToApplication
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

##################################  [OK] ##################################

def OnRestartPassword(username):
    try:
        obj = Register.objects.get(username=username)
        if obj.username == username:
            return obj, True
    except:
        try:
            obj = Register.objects.get(email=username)
            if obj.username == username:
               return obj, True
        except:
            pass
        pass
    return None, False

@api_view(['GET'])
def FindAccount(request, username):
    obj, state = OnRestartPassword(username)
    if state:
        return JsonResponse({'success': 'Account Found !'}, status=200)
    return JsonResponse({'error': 'Account Not Found !'}, status=404)

@api_view(['GET'])
def ResetPassword(request, username):
    obj, state = OnRestartPassword(username)
    if not state:
        return JsonResponse({'error': 'Account Not Found !'}, status=404)
    secure = Security.objects.get(client=obj)
    if secure.processing_send():
        if secure.can_retry():
            secure.set_code()
            secure.processing_send()
        else:
            return JsonResponse({
                "error": "Too Many Requests",
                "message": "You have exceeded the request limit. Please try again later.",
            }, status=429)
    else:
        secure.set_code()
    return JsonResponse({
        "message": "A verification code has been sent to your email. Please check your inbox and enter the code to proceed.",
    }, status=200)

@api_view(['POST'])
def VerificationCode(request, username):
    obj, state = OnRestartPassword(username)
    if not state:
        return JsonResponse({'error': 'Account Not Found !'}, status=404)
    secure = Security.objects.get(client=obj)
    if secure.processing_retry():
        if secure.can_verify() == False:
            return JsonResponse({
                "error": "Too Many Requests",
                "message": "You have exceeded the request limit. Please try again later.",}, status=429)
        secure.processing_retry()

    try:
        code = int(request.data.get('code'))
    except:
        return JsonResponse({
        "error": "Invalid OTP", 
        "message": "The OTP you entered does not match our records. Please try again."}, status=400)

    if secure.verify(code):
        response = ConnectToApplication(obj)
        response.data['message'] = "OTP verified successfully"
        return response
    
    return JsonResponse({
        "error": "Invalid OTP", 
        "message": "The OTP you entered does not match our records. Please try again."}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ChangePassword(request):
    current_user = request.user
    data = request.data

    try:
        password = data.get('password')
        re_password = data.get('re_password')
    except:
        return JsonResponse({'message': 'Password is required!', 'error': True}, status=400)
    if not password:
        return JsonResponse({'message': 'Password is required!', 'error': True}, status=400)
    if not re_password:
        return JsonResponse({'message': 'Re-password is required!', 'error': True}, status=400)
    if password != re_password:
        return JsonResponse({'message': 'Passwords do not match!', 'error': True}, status=400)
    if len(password) < 6:
        return JsonResponse({'message': 'Password must be at least 6 characters long!', 'error': True}, status=400)

    current_user.set_password(password)
    current_user.save()

    return JsonResponse({'message': 'Password updated successfully!', 'error': False}, status=200)



    
    



    

