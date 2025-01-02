# THIS SOCKET SHOULD BE OPEN WHEN THE USER LOGIN (KEEP IT ALIVE !!!!!!!!!)

['ws'] API : ws://127.0.0.1:9003/ws/connection/?token=<token>

# RECIVED EVENT NOTIFICATIONS:

# ['INVITATION', 'ACCEPT', 'DECLINE', 'UNFRIEND']

# EXAMPLE :


Object { 
    time: "2024-09-27 16:38:54.975535+00:00", 
    case: "DECLINE", 
    sender: "ayrei1", 
    picture: "http://127.0.0.1:9003/register/media/avatars/unknown.jpg", 
    "full-name": "Ayman Reifoun" 
}
​

# INVITATION : 

-> someone sent you a friend request 

# ACCEPT :

-> the one that you did sent to him an invitation has been accepted you 

# DECLINE :

-> the one that you did sent to him an invitation has been decline you

# UNFRIEND

-> the one that you are a friend with him did remove you

# (NOTE : ALWAYS LISSEN TO THE INCOMING MESSAGES FROM THE SERVER)



