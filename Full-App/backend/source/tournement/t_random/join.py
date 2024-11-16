from .show import ViewRandom
from django.db.models import Q
from .giveup import StateUpdate, OpenRoom
from .notification import BrodcastToPlayers
from tournement.models import Competition, Rooms
        
def OnJoin(account):
    lookup = Competition.objects.filter(Q(friends=False) & Q(teams=False) & Q(finished=False)).first()
    if lookup:
        if not lookup.smi1.player2:
            lookup.smi1.player2 = account
            lookup.smi1.structure[account.username] = {"result": "ongoing", "quite" : False}
            lookup.smi1.save()
            StateUpdate(lookup.smi1, lookup, lookup.smi1.player1, ["giveup", "win"], ["giveup", "ongoing"], False)
            return True, lookup
        if not lookup.smi2:
            lookup.smi2 = OpenRoom(account, lookup)
            lookup.smi2.save()
            lookup.save()
            return True, lookup
        if not lookup.smi2.player2:
            lookup.smi2.player2 = account
            lookup.smi2.structure[account.username] = {"result": "ongoing", "quite" : False}
            lookup.smi2.save()
            lookup.teams = True
            lookup.save()
            StateUpdate(lookup.smi2, lookup, lookup.smi2.player1, ["giveup", "win"], ["giveup", "ongoing"], False)
            BrodcastToPlayers(lookup, account, "READY")
            return True, lookup
    else:
        print("HERE")
        lookup = Competition.objects.create()
        lookup.smi1 = OpenRoom(account, lookup)
        lookup.smi1.save()
        lookup.save()
        return True, lookup
    return False, None

def lookupSpace(account):
    state, room = ViewRandom(account)
    if state:
        return False
    print("account : ", account.username)
    state, lookup = OnJoin(account)
    if state:
        BrodcastToPlayers(lookup, account, "JOIN")
    return state
