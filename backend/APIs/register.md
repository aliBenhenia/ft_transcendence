
__________________________________________________________________

# CREATE-ACCOUNT :

['POST'] API : http://127.0.0.1:9003/register/create-account/

# PAYLOAD :

{
    "username": "ayrei",
    "email":"ayrei@gmail.com",
    "password": "111111",
    "repassword": "111111",
    "first_name" : "Ayman",
    "last_name" : "Reifoun"
}

# Response (200) Success

"success": "Your account has been successfully created!"

# Response (409) Conflict

"error": "Email already exists, or username "

# Response (400) Bad Request

"error": "something is missing or invalid format ."

__________________________________________________________________

