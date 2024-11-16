from .notification import BrodcastToPlayers
from tournement.models import Competition, Rooms

def OpenRoom(refrence, lookup):
    room = Rooms.objects.create()
    room.player1 = refrence
    room.structure = {"score" : {"p1" : 0, "p2": 0}}
    room.structure[refrence.username] =  {"result": "ongoing", "quite" : False}
    room.save()
    return room

def OnCreate(refrence, lookup):
    lookup.final = OpenRoom(refrence, lookup)
    lookup.final.save()
    lookup.save()
    return True

def OnAdd(refrence, lookup, account):

    if not lookup.final.player1:
        lookup.final.player1 = refrence
    elif not lookup.final.player2:
        lookup.final.player2 = refrence
    else:
        return False
    lookup.final.structure[refrence.username] =  {"result": "ongoing", "quite" : False}
    lookup.final.save()
    lookup.save()
    return True

def StateCheck(lookup, refrence, instance, state, excepted):
    result = instance.structure[refrence.username]["result"]
    if result != excepted:
        return False
    instance.structure[refrence.username]["result"] = state
    instance.save()
    lookup.save()
    return True


def StateChange(refrence1, refrence2, lookup, instance, state, excepted):
    if not StateCheck(lookup, refrence1, instance, state[0], excepted[0]):
        return False
    if not StateCheck(lookup, refrence2, instance, state[1], excepted[1]):
        return False
    return True

def StateUpdate(refrence, lookup, account, state, excepted, done):

    if refrence.player1 == account and refrence.player2:
        if not StateChange(refrence.player1, refrence.player2, lookup, refrence, state, excepted):
            return False
        if not lookup.final and not done:
            return OnCreate(refrence.player2, lookup)
        if lookup.final and not done:
            return OnAdd(refrence.player2, lookup, account)
        if done:
            lookup.finished = True
            lookup.save()
            return True
        return False
    
    if refrence.player2 == account and refrence.player1:
        if not StateChange(refrence.player2, refrence.player1, lookup, refrence, state, excepted):
            return False
        if not lookup.final and not done:
            return OnCreate(refrence.player1, lookup)
        if lookup.final and not done:
            return OnAdd(refrence.player1, lookup, account)
        if done:
            lookup.finished = True
            lookup.save()
            return True
    return False

def HandleGiveUp(lookup, account):
    if lookup.final:
        if lookup.final.player1 == account or lookup.final.player2 == account:
            return StateUpdate(lookup.final, lookup, account, ["giveup", "win"], ["ongoing", "ongoing"], True)
    if lookup.smi1:
        if lookup.smi1.player1 == account or lookup.smi1.player2 == account:
            return StateUpdate(lookup.smi1, lookup, account, ["giveup", "win"], ["ongoing", "ongoing"], False)
    if lookup.smi2:
        if lookup.smi2.player1 == account or lookup.smi2.player2 == account:
            return StateUpdate(lookup.smi2, lookup, account, ["giveup", "win"], ["ongoing", "ongoing"], False)
    
    return False

def OnGiveUP(account, RoomId):
    try:
        lookup = Competition.objects.get(id=RoomId, friends=False)
    except:
        return False
    state = HandleGiveUp(lookup, account)
    if state:
        if lookup.final:
            if lookup.final.player1:
                if lookup.final.structure[lookup.final.player1.username]["result"] == "win":
                    BrodcastToPlayers(lookup, account, "FINAL")
            if lookup.final.player2:
                if lookup.final.structure[lookup.final.player2.username]["result"] == "win":
                    BrodcastToPlayers(lookup, account, "FINAL")
        BrodcastToPlayers(lookup, account, "GIVEUP")
    return state