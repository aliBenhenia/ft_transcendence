from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from users.views import RespnseHeader
from users.models import Register, Profile
from .models import FriendsRequest

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def friend_notify(request):

    searching = []

    friend_request = FriendsRequest.objects.filter(reciver_account=request.user)

    for single_request in friend_request:

        profile = Profile.objects.get(client=single_request.sender_account)
        
        print('[+] : ', single_request.sender_account.username)
        user_dict = {
            'username': single_request.sender_account.username,
            'picture': profile.avatar.url,
        }
        searching.append(user_dict)

    return RespnseHeader({'users': searching}, 200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def friends_view(request, key):

    searching = []

    current_user = request.user
    user_profile = Profile.objects.get(client=current_user)
    all_users = Register.objects.filter(username__startswith=key)[:5]

    for user in all_users:
        profile = Profile.objects.get(client=user)
        if user == current_user:
            continue

        is_pending = isInRequest(current_user, user)
        is_requested = isInRequest(user, current_user)

        is_friend = profile.list.find_friend(current_user) or user_profile.list.find_friend(user)
        user_dict = {
            'username': user.username,
            'picture': profile.avatar.url,
            'is_friend': is_friend,
            'requested' : is_requested,
            'is_pending': is_pending,
        }
        searching.append(user_dict)

    return RespnseHeader({'users': searching}, 200)


def isInRequest(current_user, user):
    try:
        info = FriendsRequest.objects.get(sender_account=current_user, reciver_account=user)
        if info:
            info = True
        else:
            info = False
    except:
        info = False
    return info


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_cancel(xrequest, username, sending):
    
    sender_user = xrequest.user
    reciver_user = Register.objects.get(username=username)

    try:
        if sending == 'true':
            new_request = FriendsRequest.objects.create(sender_account=sender_user, reciver_account=reciver_user)
            new_request.save()
            return RespnseHeader({'message': 'request sent successfuly'}, 200)
        
        elif sending == 'false':
            new_request = FriendsRequest.objects.get(sender_account=sender_user, reciver_account=reciver_user)
            new_request.delete()
            return RespnseHeader({'message': 'request cancel successfuly'}, 200)
    
        else:
            return RespnseHeader({'message': 'error 1'}, 400)

    except:
        return RespnseHeader({'message': 'error 2'}, 400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_cancel(xrequest, username, sending):

    reciver_user = xrequest.user
    sender_user = Register.objects.get(username=username)

    reciver_profile = Profile.objects.get(client=reciver_user)
    sender_profile = Profile.objects.get(client=sender_user)

    try:
        if sending == 'true':
            new_request = FriendsRequest.objects.get(sender_account=sender_user, reciver_account=reciver_user)
            new_request.delete()

            reciver_profile.list.friends.add(sender_user)
            sender_profile.list.friends.add(reciver_user)

            sender_profile.list.save()
            sender_profile.save()

            reciver_profile.list.save()
            reciver_profile.save()

            return RespnseHeader({'message': 'request accepted successfuly'}, 200)
        
        elif sending == 'false':
            new_request = FriendsRequest.objects.get(sender_account=sender_user, reciver_account=reciver_user)
            new_request.delete()
            return RespnseHeader({'message': 'request cancel successfuly'}, 200)
        
        elif sending == 'remove':
            reciver_profile.list.friends.remove(sender_user)
            reciver_profile.list.save()
            reciver_profile.save()

            sender_profile.list.friends.remove(reciver_user)
            sender_profile.list.save()
            sender_profile.save()
            return RespnseHeader({'message': f'removing {username} successfuly'}, 200)
        
        else:
            return RespnseHeader({'message': 'error 1'}, 400)
    except:
        return RespnseHeader({'message': 'error 2'}, 400)


    





