from django.shortcuts import render
from rest_framework.decorators import api_view

# Create your views here.
@api_view(['GET'])
def player_stats(request):
    pass


@api_view(['GET'])
def player_last_matches(request):
    pass