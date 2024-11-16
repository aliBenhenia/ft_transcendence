# RESET PASSWORD :
_______________________________________________________________________________

# SEND CODE :

['GET'] API : http://127.0.0.1:9003/secure/reset-password/locate/?account=<username or email>

# Response (200) OK

{
    "success": {
        "email": "ayrei@gmail.com",
        "full_name": "amu ferwe",
        "picture": "http://127.0.0.1:9003/register/media/avatars/pexels-italo-melo-881954-2379004.jpg"
    }
}

# Response (404)

"error": "We couldn't find an account matching the provided information. Please double-check your username or email address and try again."

# Response (400)

"error": "Not Valid Request Make sure that you provided the username or email correctly !"

_______________________________________________________________________________


# SEND CODE :

['POST'] API : http://127.0.0.1:9003/secure/reset-password/send/

{
    "account" : "email or username",
}

# Response (200) OK

{
    "success": "A verification code has been sent to your email. Please check your inbox and enter the code to proceed."
}

# Response (404) Not found :

{
    "error": "We couldn't find an account matching the provided information. Please double-check your username or email address and try again."
}

# Response (429) Too Many Requests

{
    "error": "Retry limit reached. Please wait ",
    "time": "0:01:00"
}

_______________________________________________________________________________

# CHECK CODE :

['POST'] API : http://127.0.0.1:9003/secure/reset-password/verify/


# PAYLOAD :

{
    "account" : "email or username",
    "code" : "904854"
}

# Note : After 3 request to incorrect Code the user will be Blocked for specific time

# Response (429) Too Many Requests

{
    "error": "Retry limit reached. Please wait ",
    "time": "0:01:00"
}

# Response (404) Not Found

CASE 1 : "error": "Invalid Verification code, Please enter a numeric code."
CASE 2 : "error": "Invalid Verification code, Please try again ."

# Response (200) OK

{
    "success": "Access granted. You can now change your password.",
    "token": "ElXFoc1kkOzFwtXnQ4dJ4Ds3npERKvJ7sMGxikcuGlP5kiwBsiq37e91woJL"
}

# NOTE : THE TOKEN IS USED FOR ONLY 5 MIN THEN IT WILL BE EXPIRE !!!!

_______________________________________________________________________________

# CHANE PASSWORD WITH TOKEN 5 MIN 

['GET'] API : http://127.0.0.1:9003/secure/reset-password/update/ElXFoc1kkOzFwtXnQ4dJ4Ds3npERKvJ7sMGxikcuGlP5kiwBsiq37e91woJL/

# Response (400) Bad Request

{
    "error": "The provided token is not recognized or is malformed."
}

# Response (404) Not found :

{
    "error": "The token has reached its expiration time and is no longer valid."
}

# Response (200) OK

"success": "you can now change your password"

['POST'] API : http://127.0.0.1:9003/secure/reset-password/update/ElXFoc1kkOzFwtXnQ4dJ4Ds3npERKvJ7sMGxikcuGlP5kiwBsiq37e91woJL/


# PAYLOAD :
{
    "password" : "111111",
    "repassword" : "111111"
}

# Response (400) Bad Request

{
    "error": "The provided token is not recognized or is malformed."
}

# Response (404) Not found :

{
    "error": "The token has reached its expiration time and is no longer valid."
}

# Response (400) Bad Request

"information": "Password is required: The password field is left blank."
"information": "Password too short: The password does not meet the minimum length requirement."
"information": "Re-Password is required: The re password field is left blank."
"information": "Password confirmation does not match: The confirmation password does not match the original password."

# Response (200) OK

"success": "Password changed successfully, You can now log in with your new password"
