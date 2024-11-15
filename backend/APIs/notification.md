# READS NOTIFICATION :

['GET'] API : http://127.0.0.1:9003/notification/api/view/

# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}

# Response (200) OK

{
    "vide": false,
    "notifications": [
        {
            "seen": false,
            "time": "2024-09-27T15:19:44.133183Z",
            "subject": "INVITATION",
            "sender": "ayrei1",
            "picture": "http://127.0.0.1:9003/register/media/avatars/unknown.jpg",
            "full-name": "Ayman Reifoun"
        },
    ],
    "total": 1
}

# or 

{'vide' : True, 'message': 'No notifications at the current time.'}

# response (401) Unauthorized

"detail": "Given token not valid for any token type",
"code": "token_not_valid",

# Response (401) Unauthorized (IMPORTANT !!)

"error": "Two-Factor Authentication (2FA) is required."
_________________________________________________________________________________

# MARK ALL AS READS

['POST'] API : http://127.0.0.1:9003/notification/api/mark/


# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}

# response (401) Unauthorized

"detail": "Given token not valid for any token type",
"code": "token_not_valid",

# Response (401) Unauthorized (IMPORTANT !!)

"error": "Two-Factor Authentication (2FA) is required."

# Response (200) OK

{'vide' : True, 'message': 'No notifications at the current time.'}

or 

"message": "all notifications has marked as read"

_________________________________________________________________________________

# DELETE ALL NOTIFICATIONS

['POST'] API : http://127.0.0.1:9003/notification/api/delete/

# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}

# response (401) Unauthorized

"detail": "Given token not valid for any token type",
"code": "token_not_valid",

# Response (401) Unauthorized (IMPORTANT !!)

"error": "Two-Factor Authentication (2FA) is required."

# Response (200) OK

{'vide' : True, 'message': 'No notifications at the current time.'}

or

"message": "all notifications has been deleted !"




