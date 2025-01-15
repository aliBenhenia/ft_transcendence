
import re
from django.db.models import Q
from friends.models import FRIENDS, BLOCKER

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
