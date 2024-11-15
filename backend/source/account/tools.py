
import re
from django.db.models import Q
from friends.models import FRIENDS, BLOCKER

def ValidateName(name, state):
    if not name:
        return '5' if state else '8'
    if len(name) > 29:
        return '6' if state else '9'
    if not bool(re.match(r'^[A-Za-z]+$', name)):
        return '7' if state else '10'
    return None

def ValidatePassword(password=None, repassword=None, oldpassword=None):
    if not password:
        return "15"
    if len(password) < 6:
        return "11"
    if len(password) > 98:
        return "12"
    if not repassword:
        return "13"
    if repassword != password:
        return "14"
    if not oldpassword:
        return "16"
    if len(oldpassword) < 6:
        return "17"
    if len(oldpassword) > 98:
        return "18"
    return None

def get_friends_list(client):
    is_friends = FRIENDS.objects.filter(Q(friends=client) | Q(account=client))
    if not is_friends:
        return None
    data = []
    total = 0
    for friend in is_friends:
        details = friend.account if friend.account != client else friend.friends
        already = BLOCKER.objects.filter(Q(blocker=client, blocked=details) | Q(blocker=details, blocked=client)).first()
        if already:
            continue
        information = {
            'username' : details.username,
            'picture' : details.photo_url,
            'full_name' : details.first_name + ' ' + details.last_name,
        }
        total += 1
        data.append(information)
    full = {'friends' : data, 'total' : total}
    return full
