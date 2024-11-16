from django.db.models import Q
from tournement.models import Competition, Rooms

def QuerySetView(account):
    rooms = Rooms.objects.filter(Q(player1=account) | Q(player2=account))
    if not rooms.first():
        return False, None
    for room in rooms:
        if room.structure.get(account.username) and room.structure.get(account.username)["quite"] == False:
            return True, room
    return False, None

def ViewRandom(account):
    state, room = QuerySetView(account)
    if not state:
        return False, None
    try:
        competition = Competition.objects.filter((Q(smi1=room) | Q(smi2=room)), friends=False).first()
        if not competition:
            return False, None
    except:
        return False, None
    return True, competition

def ViewAll(account):
    state, room = QuerySetView(account)
    if not state:
        return False, None
    try:
        competition = Competition.objects.filter((Q(smi1=room) | Q(smi2=room))).first()
        if not competition:
            return False, None
    except:
        return False, None
    return True, competition

def onView(account):
    state, lookup = ViewAll(account)
    if not state:
        return False, None
    
    information = {}
    information['room-id'] = lookup.id
    information['all_join'] = lookup.teams
    information['macth_ends'] = lookup.finished
    
    if lookup.smi1:
        information['KEY-1'] = lookup.smi1.id
        information['p1'] = lookup.smi1.player1.username
        information['p2'] = lookup.smi1.player2.username if lookup.smi1.player2 else None
        information['JSON-SMI1'] = lookup.smi1.structure
    
    if lookup.smi2:
        information['KEY-2'] = lookup.smi2.id
        information['p3'] = lookup.smi2.player1.username
        information['p4'] = lookup.smi2.player2.username if lookup.smi2.player2 else None
        information['JSON-SMI2'] = lookup.smi2.structure

    if lookup.final:
        information['KEY-X'] = lookup.smi1.id
        information['final-p1'] = lookup.final.player1.username
        information['final-p2'] = lookup.final.player2.username if lookup.final.player2 else None
        information['JSON'] = lookup.final.structure
    
    return True, information