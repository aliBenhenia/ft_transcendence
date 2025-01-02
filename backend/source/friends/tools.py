import re
from .models import BLOCKER
from django.db.models import Q
from register.models import Register
from .cases import ERROR_MSG, SUCCESS_MSG

def get_user(reciver_user):
    if not reciver_user:
        return None, ERROR_MSG['3']
    if not re.match(r'^[a-z0-9_]+$', reciver_user):
        return None, ERROR_MSG['2']
    try:
        user = Register.objects.get(username=reciver_user)
        return user, None
    except:
        return None, ERROR_MSG['1']

def on_block(account, client):
    already = BLOCKER.objects.filter(blocker=account, blocked=client).first()
    if already:
        return already, True
    block = BLOCKER.objects.create(blocker=account, blocked=client)
    return block, False

def is_blocked(account, client):

    already = BLOCKER.objects.filter(Q(blocker=account, blocked=client) | Q(blocker=client, blocked=account)).first()
    if already:
        return True, already.blocker == account
    return False, None
