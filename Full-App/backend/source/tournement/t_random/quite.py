from .notification import BrodcastToPlayers
from .giveup import OnCreate, OpenRoom, OnAdd
from tournement.models import Competition, Rooms

def StateCheck(lookup, refrence, instance, state, excepted, onSave):
    if instance.structure[refrence.username]["result"] != excepted:
        return False
    if onSave:
        instance.structure[refrence.username]["result"] = state
        instance.save()
        lookup.save()
    return True

def StateChange(refrence1, refrence2, lookup, instance, state, excepted):
    p1 = StateCheck(lookup, refrence1, instance, state[0], excepted[0], False)
    p2 = StateCheck(lookup, refrence2, instance, state[1], excepted[1], False)

    if not p1 or not p2 or instance.structure[refrence1.username]["quite"]:
        return False
    
    instance.structure[refrence1.username]["quite"] = True
    instance.save()
    StateCheck(lookup, refrence1, instance, state[0], excepted[0], True)
    StateCheck(lookup, refrence2, instance, state[1], excepted[1], True)
    return True

def OnFinal(lookup, refrence, account, done):
    if not lookup.final and not done:
        return OnCreate(refrence.player2, lookup)
    if lookup.final and not done:
        return OnAdd(refrence.player2, lookup, account)
    if done:
        lookup.finished = True
        lookup.save()
        return True
    return False

def StateUpdate(refrence, lookup, account, state, excepted, done):

    if refrence.player1 == account and refrence.player2:
        if not StateChange(refrence.player1, refrence.player2, lookup, refrence, state, excepted):
            return False
        if OnFinal(lookup, refrence, account, done):
            return True
        return False
    
    if refrence.player2 == account and refrence.player1:
        if not StateChange(refrence.player2, refrence.player1, lookup, refrence, state, excepted):
            return False
        if OnFinal(lookup, refrence, account, done):
            return True
    return False

def GroupCases(lookup, instance, account, OnState):
    actually = [["win", "giveup"],["giveup", "win"], ["win", "loss"], ["loss", "win"]]
    for check in actually:
        if StateUpdate(instance, lookup, account, check, check, OnState):
            return True
    if StateUpdate(instance, lookup, account, ["giveup", "win"], ["ongoing", "ongoing"], OnState):
        return True
    return False

def HandleCases(lookup, account):
    if lookup.final:
        if lookup.final.player1 == account or lookup.final.player2 == account:
            return GroupCases(lookup, lookup.final, account)
    if lookup.smi1:
        if lookup.smi1.player1 == account or lookup.smi1.player2 == account:
            return GroupCases(lookup, lookup.smi1, account)
    if lookup.smi2:
        if lookup.smi2.player1 == account or lookup.smi2.player2 == account:
            return GroupCases(lookup, lookup.sm2, account)
    
    return False

def CheckFunction(lookup, account, instance):
    quite = StateCheck(lookup, account, instance, None, "ongoing", False)
    if quite:
        instance.structure[account.username]["quite"] = True
        instance.save()
        return StateCheck(lookup, account, instance, "giveup", "ongoing", True)
    return False

def HandleSituation(lookup, account):

    if lookup.final:
        if lookup.final.player1 == account and not lookup.final.player2:
            return CheckFunction(lookup, account, lookup.final)
        if (lookup.final.player1 and lookup.final.player2) and (lookup.final.player1 == account or lookup.final.player2 == account):
            return StateUpdate(lookup.final, lookup, account, ["giveup", "win"], ["ongoing", "ongoing"], True)
            
    if lookup.smi1:
        if lookup.smi1.player1 == account and not lookup.smi1.player2:
            return CheckFunction(lookup, account, lookup.smi1)
        if (lookup.smi1.player1 and lookup.smi1.player2) and (lookup.smi1.player1 == account or lookup.smi1.player2 == account):
            return StateUpdate(lookup.smi1, lookup, account, ["giveup", "win"], ["ongoing", "ongoing"], False)
    
    if lookup.smi2:
        if lookup.smi2.player1 == account and not lookup.smi2.player2:
            return CheckFunction(lookup, account, lookup.smi2)
        if (lookup.smi2.player1 and lookup.smi2.player2) and (lookup.smi2.player1 == account or lookup.smi2.player2 == account):
            return StateUpdate(lookup.smi2, lookup, account, ["giveup", "win"], ["ongoing", "ongoing"], False)

    return False

def HandleQuite(account, RoomId):
    try:
        lookup = Competition.objects.get(id=RoomId, friends=False)
    except:
        return False
    state = HandleSituation(lookup, account)
    if state:
        if lookup.final:
            if lookup.final.player1:
                if lookup.final.structure[lookup.final.player1.username]["result"] == "win":
                    BrodcastToPlayers(lookup, account, "FINAL")
            if lookup.final.player2:
                if lookup.final.structure[lookup.final.player2.username]["result"] == "win":
                    BrodcastToPlayers(lookup, account, "FINAL")
        BrodcastToPlayers(lookup, account, "EXIT")
    return state
