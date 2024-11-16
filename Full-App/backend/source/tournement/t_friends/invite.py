# import json
# from django.db.models import Q
# from .models import Competition
# from .tools import generate_token
# from channels.layers import get_channel_layer
# from asgiref.sync import async_to_sync, sync_to_async


# @sync_to_async
# def view_access(account):
#     on_check = Competition.objects.filter(Q(player1=account) | Q(player2=account) | Q(player3=account) | Q(player4=account) & Q(king=None) & Q(friends=True)).first()
#     if on_check:
#         if on_check.player1 == account:
#             if on_check.winner_match1 and on_check.winner_match1 != account:
#                 return True
#             return False
#         if on_check.player2 == account:
#             if on_check.winner_match1 and on_check.winner_match1 != account:
#                 return True
#             return False
#         if on_check.player3 == account:
#             if on_check.winner_match2 and on_check.winner_match2 != account:
#                 return True
#             return False
#         if on_check.player4 == account:
#             if on_check.winner_match2 and on_check.winner_match2 != account:
#                 return True
#             return False
#     return True

# @sync_to_async
# def on_create(account):
#     current = Competition.objects.create(player1=account, token_1=generate_token(), friends=True)
#     return

# @sync_to_async
# def on_place(admin, inviter):
#     on_check = Competition.objects.filter(Q(player1=admin) & Q(king=None) & Q(friends=True)).first()
#     if not on_check:
#         return False
#     if on_check.player2 == inviter or on_check.player3 == inviter or on_check.player4 == inviter:
#         return False
#     if on_check.player2 and on_check.player3 and on_check.player4:
#         return False
#     return True

# @sync_to_async
# def team_join(intstance, admin, inviter):
#     on_check = Competition.objects.filter(Q(player1=admin) & Q(king=None) & Q(friends=True)).first()
#     if not on_check:
#         return False
    
#     placed = False
#     if (on_check.player1 == inviter or on_check.player2 == inviter or on_check.player3 == inviter or on_check.player4 == inviter):
#         return False
    
#     if not on_check.player2:
#         on_check.player2 = inviter
#         on_check.token_2 = on_check.token_1
#         placed = True
#         on_check.save()

#     if not on_check.player3 and not placed:
#         on_check.player3 = inviter
#         on_check.token_3 = generate_token()
#         placed = True
#         on_check.save()

#     if not on_check.player4 and not placed:
#         on_check.player4 = inviter
#         on_check.token_4 = on_check.token_3
#         placed = True
#         realtimeJoin(inviter, on_check, 'JOIN')
#         realtimeJoin(inviter, on_check, 'ALLOWED')
#         on_check.save()

#     if placed and not on_check.player4:
#         realtimeJoin(inviter, on_check, 'JOIN')
#     return placed

# async def on_establish(intstance, account, SUCC_ERR, ACT):
#     notification_data =  {
#         'type': 'on_invite_friend',
#         'ACTION' : ACT,
#         'command' : SUCC_ERR,
#     }
#     return await intstance.channel_layer.group_send(account.token_notify, notification_data)

# async def on_communicate(intstance, account, to, command):
#     notification_data =  {
#         'type': 'on_invite_friend',
#         'command' : command,
#         'sender' : account.username,
#     }
#     return await intstance.channel_layer.group_send(to.token_notify, notification_data)

# async def forward_event_tournemet(intstance, data, reciver, sender):

#     if data['command'] == 't-group':
    
#         if not view_access(sender):
#             notification_data =  {
#                 'type': 'on_invite_friend',
#                 'ACTION' : 'CREATE',
#                 'command' : 'ERROR',
#             }
#             return await intstance.channel_layer.group_send(sender.token_notify, notification_data)
    
#         await on_create(sender)
#         notification_data =  {
#             'type': 'on_invite_friend',
#             'ACTION' : 'CREATE',
#             'command' : 'SUCCESSFULY',
#         }
#         return await intstance.channel_layer.group_send(sender.token_notify, notification_data)
         
#     if data['command'] == 't-invite':
#         state = await on_place(sender, reciver)
#         if not state:
#             return await on_establish(intstance, sender, 'ERROR', 'INVITE')
#         await on_communicate(intstance, sender, reciver, 'INVITE')
#         return await on_establish(intstance, sender, 'SUCCESSFULY', 'INVITE')

#     if data['command'] == 't-accept':
#         state = await team_join(instance, reciver, sender)
#         if state:
#             return await on_establish(intstance, sender, 'SUCCESSFULY', 'JOINED')
#         return await on_establish(intstance, sender, 'ERROR', 'INVITE')
    
#     if data['command'] == 't-cancel':
#         await on_communicate(intstance, sender, reciver, 'CANCEL')

# async def invite_friend(consumer_instance, event):
#     try:
#         action = event.get('ACTION')
#         if action:
#             await consumer_instance.send(text_data=json.dumps({
#                 'case': 'CMP-TOURNEMENT',
#                 'action': action,
#                 'command' : event['command'],
#             }))
#         else:
#             await consumer_instance.send(text_data=json.dumps({
#                 'case': 'CMP-TOURNEMENT',
#                 'sender': event['sender'],
#                 'command' : event['command'],
#             }))
#     except Exception as e:
#         print('[+] : ', e)

# def OnChecking1(account):
#     lookup = Competition.objects.filter(Q(friends=False) & Q(teams=False) & Q(finished=False)).first()
#     if lookup:
#         return not PlayerInRoom(lookup, account)
#     return True

# def OnChecking2(account):
#     lookup = Competition.objects.filter(Q(friends=False) & Q(teams=True) & Q(finished=False)).first()
#     if lookup:
#         return PlayerExist(lookup, account, True)
#     return True

# def onGoing(refrence, account):
#     quite = refrence.structure[account.username]["quite"]
#     result = refrence.structure[account.username]["result"]

#     return True if (quite == True or result == "giveup" or result == "loss") else False

# def PlayerExist(lookup, account, state):
#     if state:
#         if lookup.final:
#             if lookup.final.player1 == account or lookup.final.player2 == account:
#                 return onGoing(lookup.final, account)
#     if lookup.smi1:
#         if lookup.smi1.player1 == account or lookup.smi1.player2 == account:
#             return onGoing(lookup.smi1, account)
#     if lookup.smi2:
#         if lookup.smi2.player1 == account or lookup.smi2.player2 == account:
#             return onGoing(lookup.smi2, account)
#     return True

# def PlayerInRoom(lookup, account):
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