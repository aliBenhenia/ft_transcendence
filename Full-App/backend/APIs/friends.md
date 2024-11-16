# BLOCKED LIST :

['GET'] : http://127.0.0.1:9003/friends/blocklist/

# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}

# Response (200) OK :

{
    "vide": false,
    "list": [
        {
            "username": "ayrei1",
            "picture": "http://127.0.0.1:9003/register/media/avatars/unknown.jpg",
            "full_name": "Ayman Reifoun"
        }
    ]
}

# or

{
    "vide": true
}



______________________________________________________________________________________________

# GLOBAL RESPONSE (IMPORTANT !!)

# Response (401) Unauthorized (IMPORTANT !!)

"error": "Two-Factor Authentication (2FA) is required."

# response (401) Unauthorized

"detail": "Given token not valid for any token type",
"code": "token_not_valid",


______________________________________________________________________________________________

# GET INFO QUERY (return up to 10 recodes):

['GET'] API : http://127.0.0.1:9003/friends/search/?username=<username_start_with>

# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}

# Response (200) OK :

{
    "success": [
        {
            "username": "ayrei1",
            "picture": "http://127.0.0.1:9003/register/media/avatars/unknown.jpg",
            "full_name": "Ayman Reifoun"
        },
        {
            "username": "ayrei2",
            "picture": "http://127.0.0.1:9003/register/media/avatars/unknown.jpg",
            "full_name": "Ayman Reifoun"
        },
    ]
}

# Response (400) Bad Request :

"error": "Invalid request: Username is required to complete this action."
"error": "The username cannot contain special characters."


# Response (404) Not Found :

"error": "Sorry, we couldn't find an account for that username."


______________________________________________________________________________________________

# GET INFO QUERY (ONLY ONE RECORDE):
# CASE : INVITATION SENT , WAITING TO ACCEPT, ARE FRIENDS

['GET'] API : http://127.0.0.1:9003/friends/status/?username=<username>

# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}

# Response (400) Bad Request :

"error": "Action Not Allowed : You cannot see a friend status for yourself."
"error": "Invalid request: Username is required to complete this action."
"error": "The username cannot contain special characters."

# Response (200) OK :

{
    "success": {
        "invite_me": false,
        "on_request": false,
        "is_friends": false,
        "is_blocked": true,
        "blocked_by": "ayrei"
    }
}

______________________________________________________________________________________________

# SEND A FRIENDS REQUEST :

['POST'] API : http://127.0.0.1:9003/friends/request/


# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}

# PAYLOAD :

{
    "username" :  "<username>"
}

# Response (400) Bad Request :

"error": "The username cannot contain special characters."
"error": "User cannot send a request to themselves."
"error": "You have already sent an invitation to this user."

# Response (404) Not Found :

"error": "Invalid request: Username is required to complete this action."
"error": "Sorry, we couldn't find an account for that username."


# Response (200) OK :

"success": "Invitation sent successfully! The user will receive a notification shortly."

______________________________________________________________________________________________

# CANCEL A FRIENDS REQUEST :

['POST'] API : http://127.0.0.1:9003/friends/decline/

# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}

# PAYLOAD :

{
    "username" :  "<username>"
}

# Response (400) Bad Request :

"error": "Invalid request: Username is required to complete this action."
"error": "The username cannot contain special characters."
"error": "Sorry, we couldn't find an account for that username."
"error": "You cannot decline an invitation for yourself."

# Response (404) Not Found :

"error": "Action Not Allowed !"

# Response (200) OK :

"success": "You have successfully declined the friend request."

______________________________________________________________________________________________

# ACCEPT A FRIENDS REQUEST :

['POST'] API : http://127.0.0.1:9003/friends/accept/

# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}

# PAYLOAD :

{
    "username" :  "<username>"
}

# Response (400) Bad Request :

"error": "Invalid request: Username is required to complete this action."
"error": "The username cannot contain special characters."
"error": "Sorry, we couldn't find an account for that username."
"error": "User cannot accept a request to themselves."

# Response (200) OK :

"success": "Invitation accepted! You are now friends."


______________________________________________________________________________________________

# REMOVE A FRIENDS  :

['POST'] API : http://127.0.0.1:9003/friends/delete/

# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}

# PAYLOAD :

{
    "username" :  "<username>"
}

# Response (400) Bad Request :

"error": "Invalid request: Username is required to complete this action."
"error": "The username cannot contain special characters."
"error": "Sorry, we couldn't find an account for that username."
"error": "Action Not Allowed !"


# Response (200) OK :

"success": "Success! You are no longer friends !"

______________________________________________________________________________________________

# EXAMPLE (OPEN_SOCKET):

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3NjI1NTMxLCJpYXQiOjE3Mjc1MzkxMzEsImp0aSI6IjVmYTNjMWYxZjEzYzRlODE4YTY4ODJmMTgxZTM3Y2M5IiwidXNlcl9pZCI6MX0.j1jC3KEIJ6gLVh_QUk3Uuvs3FYYiwSLmgIyIPHBr33w'

const notificationSocket = new WebSocket(`ws://127.0.0.1:9003/ws/connection/?token=${token}`);

// Event handler for incoming messages
notificationSocket.onmessage = function(e) {
    try {
        const data = JSON.parse(e.data);
        console.log('[+] : ', data); // Use console.log for better visibility
        // Handle the data as needed
    } catch (error) {
        console.error('Error parsing message:', error);
    }
};

// Event handler for when the WebSocket connection closes
notificationSocket.onclose = function(e) {
    console.error('Notification socket closed unexpectedly');
};

// Optional: Event handler for errors
notificationSocket.onerror = function(error) {
    console.error('WebSocket Error: ', error);
};

// Optional: Event handler for when the connection opens
notificationSocket.onopen = function(e) {
    console.log('WebSocket connection established');
};

______________________________________________________________________________________________

# GET FRIENDS LIST

['GET'] API : http://127.0.0.1:9003/friends/list/

# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}

# Response (200) OK :

{
    "vide": false,
    "information": [
        {
            "full_name": "Ayman Reifoun",
            "username": "ayrei1",
            "picture": "http://127.0.0.1:9003/register/media/avatars/unknown.jpg",
            "is_blocked": true,
            "blocked_by": "ayrei"
        }
    ]
}

# or 

{
    "vide": false,
    "information": [
        {
            "full_name": "Ayman Reifoun",
            "username": "ayrei1",
            "picture": "http://127.0.0.1:9003/register/media/avatars/unknown.jpg",
            "is_blocked": true,
            "blocked_by": "ayrei"
        }
    ]
}

# or

{
    "vide": true
}

______________________________________________________________________________________________



# GET INVITATION REQUEST LIST :

['GET'] API : http://127.0.0.1:9003/friends/invitations/

# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}

# Response (200) OK :

{
    "vide": false,
    "information": [
        {
            "full_name": "Ayman Reifoun",
            "username": "ayrei1",
            "picture": "http://127.0.0.1:9003/register/media/avatars/unknown.jpg"
        }
    ]
}

# or

{
    "vide": true
}


______________________________________________________________________________________________


# BLOCK A USER :

['POST'] API : http://127.0.0.1:9003/friends/block/

# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}

# PAYLOAD :

{
    "username" :  "<username>"
}

# Response (200) OK :

"success": "User has been blocked successfully."


______________________________________________________________________________________________

# UNBLOCK A USER :

['POST'] API : http://127.0.0.1:9003/friends/unblock/

# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}

# PAYLOAD :

{
    "username" :  "<username>"
}

# Response (200) OK :

"success": "User has been unblocked successfully."
