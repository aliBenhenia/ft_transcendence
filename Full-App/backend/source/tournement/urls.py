from django.urls import path
from .views import delete_tournement, view_tournement
from .t_random.view import random_join, random_history, random_exit, random_view, random_giveup

urlpatterns = [
    
    path('view/', random_view),
    path('join/', random_join),
    path('quite/', random_exit),
    path('giveup/', random_giveup),
    path('history/', random_history),

    # FOR TESTING : 
    path('list/', view_tournement),
    path('delete/', delete_tournement),
]