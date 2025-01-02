from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Register, RegisterException
from .error import ALL_CASSES 

class RegisterAccount(APIView):
    
    permission_classes = [AllowAny]

    def post(self, request):

        try:
            obj = Register.objects.create_user(request.data)
        except Exception as e:
            error_case = str(e)
            if error_case in ALL_CASSES:
                default_status = 400 if error_case != "7" and error_case != "13" else 409
                return Response({'error': ALL_CASSES[error_case]}, status=default_status)
            return Response({'error':'Invalid Information Try Again With Valid Information!'}, status=400)
        return Response({'success':'Your account has been successfully created!'}, status=201)
    

