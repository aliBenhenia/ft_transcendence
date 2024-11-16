from .models import Register
from rest_framework.response import Response
from rest_framework import status
from .oauth2 import ConnectToApplication
from rest_framework.decorators import api_view

##################################  [OK] ##################################

# Check The Activation link
@api_view(['GET'])
def ActivationLink(request, token):
    try:
        obj = Register.objects.get(activate_token=token)
        if obj.username:
            obj.is_active = True
            obj.save()
            return ConnectToApplication(obj)
        return Response({'error': 'invalid activation link'}, status=status.HTTP_404_NOT_FOUND)
    except Register.DoesNotExist:
        return Response({'error': 'invalid activation link'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def ResetPassword(request, token):
    pass

