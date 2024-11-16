from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db import connection

@api_view(['GET'])
def see_database(request):
    rows = []
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM ont")
        rows = cursor.fetchall()
    return Response({'success' : rows}, status=200)

