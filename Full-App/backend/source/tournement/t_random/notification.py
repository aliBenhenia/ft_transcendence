from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

def BroadCheck(refrence, account, command):
    if refrence.player1 and not refrence.structure[refrence.player1.username]["quite"]:
        SendNotification(account, refrence.player1, command)
    if refrence.player2 and not refrence.structure[refrence.player2.username]["quite"]:
        SendNotification(account, refrence.player2, command)

def BrodcastToPlayers(lookup, account, command):
    if lookup.smi1:
        BroadCheck(lookup.smi1, account, command)
    if lookup.smi2:
        BroadCheck(lookup.smi2, account, command)
    
def SendNotification(account, to, command): 
    try:
        channel_layer = get_channel_layer()
        notification_data =  {'type':'INSTRUCTION', 'command':command, 'case':'TOURNEMENT-RANDOM', 'sender':account.username}
        async_to_sync(channel_layer.group_send)(to.token_notify, notification_data)
    except Exception as e:
        print("[->] BroadCast RANDOM : ", e)