# NOTE : ONLY IF YOU ARE FRIENDS !!!!!!!!!

# QUERY A CONVERSTATION :

['GET'] API : http://127.0.0.1:9003/chat/conversation/?account=<email ? username>

# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}

# Response (200) OK :

{
    "vide": true,
    "message": "No Messages Recived at the current time !"
}

# or

{
    "vide": false,
    "sender-info": {
        "on_talk": "ayrei",
        "online": true,
        "picture": "http://127.0.0.1:9003/register/media/avatars/pexels-italo-melo-881954-2379004.jpg",
        "full_name": "amu ferwe"
    },
    "data": [
        {
            "sender": "ayrei",
            "reciver": "ayrei1",
            "message": "hello",
            "time": "2024-09-28 14:41:27"
        },
        {
            "sender": "ayrei",
            "reciver": "ayrei1",
            "message": "hello 1",
            "time": "2024-09-28 14:46:57"
        },
        {
            "sender": "ayrei1",
            "reciver": "ayrei",
            "message": "hello 2",
            "time": "2024-09-28 14:55:21"
        }
    ]
}

# Response (400 - 404) : 

Descriptive Error !!

# RESONSE (401) 2FA => (REDIRECT) 

_____________________________________________________________________________________________

# SEND A MESAAGE :

['POST'] API : http://127.0.0.1:9003/chat/message/

# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}

# PAYLOAD

{
    "account" : "<username or email>", 
    "message" : "hello world"
}


# Response (200) OK :

"success": "Message sent successfully."

# Response (400 - 404) : 

Descriptive Error !!

# RESONSE (401) 2FA => (REDIRECT) 

_____________________________________________________________________________________________

# GET CONVERSATION LIST :

['GET'] API : http://127.0.0.1:9003/chat/list-conversation/

# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}


# Response (200) OK :

{
    "vide": false,
    "info": [
        {
            "on_talk": "ayrei",
            "online": true,
            "picture": "http://127.0.0.1:9003/register/media/avatars/pexels-italo-melo-881954-2379004.jpg",
            "full_name": "amu ferwe",

            "sender": "ayrei1",
            "reciver": "ayrei",
            "message": "hello 2",
            "time": "2024-09-28 14:55:21"
        }
    ]
}

# on_talk means with who you talking to or talk with you

# Response (400 - 404) : 

Descriptive Error !!

# RESONSE (401) 2FA => (REDIRECT) 

_____________________________________________________________________________________________

# SEE socket.md 

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

# RESPONSE

Object { case: "NEW_MESSAGE", time: "2024-09-28 16:00:23", message: "hello 2", sender: "ayrei1", picture: "http://127.0.0.1:9003/register/media/avatars/unknown.jpg", "full-name": "Ayman Reifoun" }

_____________________________________________________________________________________________



