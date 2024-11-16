from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from datetime import datetime
from django.http import JsonResponse
from .models import FriendsList, Message
from users.models import Register, Profile
from django.db.models import Q

def timeConverter(i_time):
    date_obj = datetime.fromisoformat(str(i_time))    
    date_str = date_obj.strftime('%Y-%m-%d %H:%M:%S')
    return date_str


def QueryScrapper(username, auth_user):

    reciver = Register.objects.get(username=username)
    sender_profile = Profile.objects.get(client=auth_user)
    reciver_profile = Profile.objects.get(client=reciver)

    return auth_user, sender_profile, reciver, reciver_profile

def QueryLastMessage(auth_user, username):
    sender, sender_profile, reciver, reciver_profile = QueryScrapper(username, auth_user)
    
    last_message = None
    try :
        messages_a = Message.objects.filter(sender_msg=sender, reciver_msg=reciver)
        messages_b = Message.objects.filter(sender_msg=reciver, reciver_msg=sender)
    
        messages = (messages_a | messages_b).order_by('-time')
        last_message = messages.first()
    except:
        return None
    #print('[-] : ', last_message.Message)
    if last_message:
        return {
            'last-message': last_message.Message,
            'message-time': last_message.time,
            'sender': last_message.sender_msg,
            'reciver': last_message.reciver_msg,
        }
    else:
        return None

def QueryByMessages(auth_user):
    objects_a = Message.objects.filter(sender_msg=auth_user)
    objects_b = Message.objects.filter(reciver_msg=auth_user)
    
    all_messages = objects_a | objects_b
    user_unique = []
    
    for xmessage in all_messages:
        if xmessage.reciver_msg != auth_user and xmessage.reciver_msg not in user_unique:
            user_unique.append(xmessage.reciver_msg)
        
        if xmessage.sender_msg != auth_user and xmessage.sender_msg not in user_unique:
            user_unique.append(xmessage.sender_msg)
    
    return reversed(user_unique)

    #print('[>]', user_unique)
    #print(f"Sender : {xmessage.sender_msg.username}, Receiver: {xmessage.reciver_msg.username}, Date: {timeConverter(xmessage.time)}, Text: {xmessage.Message}")


def ParseFriendsInfo(auth_user, username):
    
    QueryByMessages(auth_user)
    friend_register = Register.objects.get(username=username)
    friend_profile = Profile.objects.get(client=friend_register)

    msg = QueryLastMessage(auth_user, username)
    if msg:
        sender = username
        reciver = 'me'
        lastmsg = msg['last-message']
        with_date = timeConverter(msg['message-time'])
        if msg['sender'] == auth_user:
            sender = 'me'
            reciver = username
        seen = "seen"
    else:
        lastmsg = f"Say Hi to Your Friend {username}"
        reciver = with_date = sender = False
        seen = None
    
    friend_dict = {
        'username': username,
        'picture': friend_profile.avatar.url,
        'is-online' : True,
        'last-message': lastmsg,
        'message-time': with_date,
        'sender': sender,
        'reciver': reciver,
        'seen': "seen",
    }
    return friend_dict

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def DefaultRooms(request):
    auth_user = request.user
    auth_profile = Profile.objects.get(client=auth_user)
    friends_query = auth_profile.list.list_friends(None, False)

    no_discussion = []
    for friends in friends_query:
        no_discussion.append(friends.username)
    
    saved_messages = QueryByMessages(auth_user)

    result = []
    existing = []
    for friend in saved_messages:
        existing.append(friend.username)
        friendsInfo = ParseFriendsInfo(auth_user, friend.username)
        result.append(friendsInfo)
    for newdisscus in no_discussion:
        if newdisscus not in existing:
            friendsInfo = ParseFriendsInfo(auth_user, newdisscus)
            result.append(friendsInfo)

    return  JsonResponse({'friends': result}, status=200)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def DisplayMessages(request, username):
    
    sender, sender_profile, reciver, reciver_profile = QueryScrapper(username, request.user)

    messages_a = Message.objects.filter(sender_msg=sender, reciver_msg=reciver)
    messages_b = Message.objects.filter(sender_msg=reciver, reciver_msg=sender)

    to_display = []
    messages = (messages_a | messages_b).order_by('time')
    for xmessage in messages:
        picture = sender_profile.avatar.url if xmessage.sender_msg == sender else reciver_profile.avatar.url

        msg = {
            'sender': 'me' if xmessage.sender_msg == sender else xmessage.sender_msg.username,
            'reciver' : 'me' if xmessage.reciver_msg == sender else xmessage.reciver_msg.username,
            'textmessage' : xmessage.Message,
            'picture': picture,
            'date' : timeConverter(xmessage.time),
        }
        to_display.append(msg)
        #print(f"Sender : {xmessage.sender_msg.username}, Receiver: {xmessage.reciver_msg.username}, Date: {timeConverter(xmessage.time)}, Text: {xmessage.Message}")
    #print('[x] ', to_display)
    return  JsonResponse({'messages': to_display}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def SendMessages(request, username):
    
    sender, sender_profile, reciver, reciver_profile = QueryScrapper(username, request.user)
    
    #print('request.data : ', request.data['message'])
    
    Object_Message = Message.objects.create(sender_msg=sender, reciver_msg=reciver, Message=request.data['message'])
    Object_Message.save()
    
    #DisplayMessages(request, username)
    return  JsonResponse({'message': 'good'}, status=200)
