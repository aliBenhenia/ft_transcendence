# from .models import Competition
# from asgiref.sync import sync_to_async
# from django.db.models import Q
# import json
# from django.db.models import Q
# from friends.tools import is_blocked
# from .models import Competition, Rooms
# from asgiref.sync import async_to_sync
# from channels.layers import get_channel_layer

# def HandleFinal(lookup, account):
#     if lookup.final.player1 == account or lookup.final.player2 == account:
#             if lookup.final.structure[account.username]["quite"]:
#                 return True, "ALREADY"
            
#             result = lookup.final.structure[account.username]["result"]
#             if result == "ongoing":
#                 lookup.final.structure[account.username]["result"] = "giveup"
#                 if lookup.final.player1 and lookup.final.player1 == account:
#                     if lookup.final.player2 and lookup.final.structure[lookup.final.player2.username]["result"] == "ongoing":
#                         lookup.finished = True
#                         lookup.final.structure[lookup.final.player2.username]["result"] = "win"

#                 if lookup.final.player2 and lookup.final.player2 == account:
#                     if lookup.final.player1 and lookup.final.structure[lookup.final.player1.username]["result"] == "ongoing":
#                         lookup.finished = True
#                         lookup.final.structure[lookup.final.player1.username]["result"] = "win"
                
#                 BrodcastToPlayers(lookup, account, "GIVEUP")
                
#             lookup.final.structure[account.username]["quite"] = True
#             lookup.final.save()
#             lookup.save()
#             return True, None
#     return False, None

# def HandleSMI1(lookup, account):

#     if lookup.smi1.player1 == account or lookup.smi1.player2 == account:
#         if lookup.smi1.structure[account.username]["quite"]:
#             return True, "ALREADY"
        
#         result = lookup.smi1.structure[account.username]["result"]

#         if result == "ongoing":
#             lookup.smi1.structure[account.username]["result"] = "giveup"
#             if lookup.smi1.player1 and lookup.smi1.player1 == account:
#                 if lookup.smi1.player2 and lookup.smi1.structure[lookup.smi1.player2.username]["result"] == "ongoing":
#                     lookup.smi1.structure[lookup.smi1.player2.username]["result"] = "win"
#                     if not lookup.final:
#                         CreateFinal(lookup.smi1.player2, lookup, True)
#                     else:
#                         AppendFinal(lookup.smi1.player2, lookup, False)
        
#             if lookup.smi1.player2 and lookup.smi1.player2 == account:
#                 if lookup.smi1.player1 and lookup.smi1.structure[lookup.smi1.player1.username]["result"] == "ongoing":
#                     lookup.smi1.structure[lookup.smi1.player1.username]["result"] = "win"
#                     if not lookup.final:
#                         CreateFinal(lookup.smi1.player1, lookup, True)
#                     else:
#                         AppendFinal(lookup.smi1.player1, lookup, False)
#             BrodcastToPlayers(lookup, account, "GIVEUP")

#         lookup.smi1.structure[account.username]["quite"] = True
#         lookup.smi1.save()
#         lookup.save()
#         return True, None
#     return False, None

# def BroadCheck(refrence, account, command):
#     if refrence.player1 and not refrence.structure[refrence.player1.username]["quite"]:
#         brodcast_tournement(account, refrence.player1, command)
#     if refrence.player2 and not refrence.structure[refrence.player2.username]["quite"]:
#         brodcast_tournement(account, refrence.player2, command)

# def BrodcastToPlayers(lookup, account, command):
#     if lookup.smi1:
#         BroadCheck(lookup.smi1, account, command)
#     if lookup.smi2:
#         BroadCheck(lookup.smi2, account, command)

# def HandleSMI2(lookup, account):
#     if lookup.smi2.player1 == account or lookup.smi2.player2 == account:
#         if lookup.smi2.structure[account.username]["quite"]:
#             return True, "ALREADY"
        
#         result = lookup.smi2.structure[account.username]["result"]
#         if result == "ongoing":
#             lookup.smi2.structure[account.username]["result"] = "giveup"
#             if lookup.smi2.player1 and lookup.smi2.player1 == account:
#                 if lookup.smi2.player2 and lookup.smi2.structure[lookup.smi2.player2.username]["result"] == "ongoing":
#                     lookup.smi2.structure[lookup.smi2.player2.username]["result"] = "win"
#                     if not lookup.final:
#                         CreateFinal(lookup.smi2.player2, lookup, True)
#                     else:
#                         AppendFinal(lookup.smi2.player2, lookup, False)

#             if lookup.smi2.player2 and lookup.smi2.player2 == account:
#                 if lookup.smi2.player1 and lookup.smi2.structure[lookup.smi2.player1.username]["result"] == "ongoing":
#                     lookup.smi2.structure[lookup.smi2.player1.username]["result"] = "win"
#                     if not lookup.final:
#                         CreateFinal(lookup.smi2.player1, lookup, True)
#                     else:
#                         AppendFinal(lookup.smi2.player1, lookup, False)
#             BrodcastToPlayers(lookup, account, "GIVEUP")

#         lookup.smi2.structure[account.username]["quite"] = True
#         lookup.smi2.save()
#         lookup.save()
#         return True, None
#     return False, None
    

# def HandleQuite(account, RoomId):
#     try:
#         lookup = Competition.objects.get(id=RoomId, friends=False)
#         if not lookup:
#             return "NOTFOUND"
#     except:
#         return "NOTFOUND"
#     if lookup.final:
#         state, key = HandleFinal(lookup, account)
#         if state:
#             return False if key == "ALREADY" else True
#     if lookup.smi1:
#         state, key = HandleSMI1(lookup, account)
#         if state:
#            return False if key == "ALREADY" else True

#     if lookup.smi2:
#         state, key = HandleSMI2(lookup, account)
#         if state:
#            return False if key == "ALREADY" else True
        
#     return "ERROR"


# def brodcast_tournement(account, to, command): 
#     try:
#         channel_layer = get_channel_layer()
#         notification_data =  {
#             'type': 'INSTRUCTION',
#             'command' : command,
#             'case' : 'TOURNEMENT',
#             'sender' : account.username,
#         }
#         async_to_sync(channel_layer.group_send)(to.token_notify, notification_data)
#     except Exception as e:
#         print("[->] brodcast_tournement : ", e)

# def onGoing(refrence, account):
#     quite = refrence.structure[account.username]["quite"]
#     result = refrence.structure[account.username]["result"]

#     return True if (quite == True or result == "giveup" or result == "loss") else False

# def PlayerRoom(lookup, account):
#     if lookup.final:
#         if lookup.final.player1 == account or lookup.final.player2 == account:
#             return True

#     if lookup.smi1:
#         if lookup.smi1.player1 == account or lookup.smi1.player2 == account:
#             return True
#     if lookup.smi2:
#         if lookup.smi2.player1 == account or lookup.smi2.player2 == account:
#             return True

#     return False
    
