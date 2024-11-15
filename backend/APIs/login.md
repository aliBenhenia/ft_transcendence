__________________________________________________________________

# ACCESS-TOKEN

['POST'] API : http://127.0.0.1:9003/login/api/token/

# PAYLOAD :

{
    "email": "ayrei@gmail.com"
    "password" : "111111"
}

# Response (401) Unauthorized

"detail": "No active account found with the given credentials"

# Response (400) Bad Request

somehing is missing email or password

# Response (200) OK

{
    "refresh": "TOKEN1",
    "access": "TOKEN2"
}

__________________________________________________________________

# REFRECH TOKEN 

['POST'] API : http://127.0.0.1:9003/login/api/token/

# PAYLOAD :

{
   "refresh": "TOKEN1"
}

# Response (400) Bad Request

refresh token is missing .

# Response (401) Unauthorized

"detail": "Token is invalid or expired",
"code": "token_not_valid"

# Response (200) OK

{
    "access": "TOKEN"
}

__________________________________________________________________


