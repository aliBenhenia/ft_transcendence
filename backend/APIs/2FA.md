_______________________________________________________________________________

# (401) - "error": "Two-Factor Authentication (2FA) is required."

# GET 2FA CODE

['GET'] API : http://127.0.0.1:9003/secure/verification/send/ // unused

# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}

# Response (401) Unauthorized

"detail": "Given token not valid for any token type",
"code": "token_not_valid",

# Response (200) OK

"success": "Two-Factor Authentication (2FA) code has been sent to your email. Please check your inbox and enter the 2FA code to access your account."

# (ON SERVER YOU WILL SEE)  django  | code :  283123

# Note : After 3 request to the 2FA the user will be Blocked for specific time

# Response (429) Too Many Requests

{
    "error": "Retry limit reached. Please wait ",
    "time": "0:01:00"
}

_______________________________________________________________________________

# Verify 2FA CODE :

['POST'] API : http://127.0.0.1:9003/secure/verification/check/

# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}

# PAYLOAD :

{
    "code" : "904854",
    user_id : number
}

# Note : After 3 request to incorrect 2FA Code the user will be Blocked for specific time

# Response (429) Too Many Requests

{
    "error": "Retry limit reached. Please wait ",
    "time": "0:01:00"
}

# Response (404) Not found :

"error": "Authentication failed. Please check the 2FA code and try again."

# Response (401) Unauthorized

"detail": "Given token not valid for any token type",
"code": "token_not_valid",

# Response (404) Not found :

{
    "error": "The 2FA code you entered is incorrect. Please try again."
}

# Response (200) OK

{
    "success": "Your 2FA code has been verified successfully. You can now access your account."
}

# (ON SERVER-SIDE IT GONNA UNBLOCK HIS JWT AND GIVE HIM FULL ACCESS TO THE ACCOUNT)

