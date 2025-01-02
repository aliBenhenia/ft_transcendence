_______________________________________________________________________________

# FETCH PROFILE DATA

['GET'] API : http://127.0.0.1:9003/account/profile/

# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}

# response (401) Unauthorized

"detail": "Given token not valid for any token type",
"code": "token_not_valid",

# Response (401) Unauthorized (IMPORTANT !!)

"error": "Two-Factor Authentication (2FA) is required."

# (SEE 2FA Docs) - JWT IS BLOCKED BEFORE 2FA VERIFICATION

# response (200) OK

{
    "informations": {
        "email": "ayrei@gmail.com",
        "username": "ayrei",
        "online": false,
        "picture": "http://127.0.0.1:9003/register/media/avatars/unknown.jpg",
        "full_name": "Ayman Reifoun",
        "win": 0,
        "loss": 0,
        "level": 1,
        "xp_total": 0,
        "total_match": 0,
        "achievements": 1
    }
}

_______________________________________________________________________________

# FETCH OTHER USER PROFILE DATA

['GET'] API : http://127.0.0.1:9003/account/search/?username=<username>

# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}


# Response (400) Bad Request:

"error": "You must provide a username." (ignore)
"error": "The username cannot contain special characters." (use it example : ?username=;')

# Response (404) Not Found :

"error": "Sorry, we couldn't find an account for that username."

# Response (200) OK :

{
    "account": {
        "username": "ayrei1",
        "online": true,
        "picture": "http://127.0.0.1:9003/register/media/avatars/unknown.jpg",
        "full_name": "Ayman Reifoun",
        "win": 0,
        "rank": 2,
        "loss": 0,
        "level": 1,
        "xp_total": 0,
        "total_match": 0,
        "achievements": "Bronze I"
    },
    "details": {
        "friends": [
            {
                "username": "ayrei",
                "picture": "http://127.0.0.1:9003/register/media/avatars/pexels-italo-melo-881954-2379004.jpg",
                "full_name": "amu ferwe"
            }
        ],
        "total": 1
    }
}

_______________________________________________________________________________

# UPDATE PROFILE 

['POST'] API : http://127.0.0.1:9003/account/update/

# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}


# PYLOAD
{
    'picture': "",
    'first_name': "",
    'last_name': "",

    'old_password' : "",
    'new_password' : "",
    're_password' : "",

}

# Response (200) OK :

success: "Profile updated successfully, Your changes have been saved."

# Response (401) Unauthorized (IMPORTANT !!)

"error": "Two-Factor Authentication (2FA) is required."

# response (401) Unauthorized

"detail": "Given token not valid for any token type",
"code": "token_not_valid",


# Response (400) Bad Request:

    "5" : 'First name is required: The first name field is left blank.',
    "6" : "First name too long: The first name doesn't meet length requirements.",
    "7" :  "First name contains invalid characters: special characters, numbers, or symbols that aren't allowed.",

    # LAST NAME CASES

    "8" : 'Last name is required: The last name field is left blank.',
    "9" : "Last name too long: The last name doesn't meet length requirements.",
    "10" :  "Last name contains invalid characters: special characters, numbers, or symbols that aren't allowed.",

    # PASSWORD CASES

    "11": 'New Password too short: The New password does not meet the minimum length requirement.',
    "12": 'New Password too long: The New password exceeds the maximum allowed length.',
    "15": 'The New Password is required: The New password field is left blank.',

    "13": 'Re-Password is required: The re password field is left blank.',
    "14": 'Password confirmation does not match: The confirmation password does not match the original password.',
    
    "16" : "The old Password is required: The old password field is left blank.",
    "17" : 'The old Password too short: The old password does not meet the minimum length requirement.',
    "18" : 'The old Password too long: The old password exceeds the maximum allowed length.',
    "19" : 'The provided old password does not match our records.',
    "21" : 'The same old password provided in the new password, try with diffrent new password',

    # IMAGE CHECKING 

    "20" : "Invalid image file. Please upload a valid image."

_______________________________________________________________________________

# ACTIVATE 2FA :

['POST'] API : http://127.0.0.1:9003/account/2FA/

# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}


# PYLOAD
{
    "status" : <true, false>
}

# Response (200) OK :

"success": "Two-Factor Authentication (2FA) is Activated!"
"success": "Two-Factor Authentication (2FA) is Deactivated!"


# Response (400) Bad Request:

"error": "Two-Factor Authentication (2FA) is Already Activated!"
"error": "Two-Factor Authentication (2FA) is Already Deactivated!"
"error": "This Action is Not Allowed !"

_______________________________________________________________________________

# CHECK THE STATUS OF 2FA :

['GET'] API : http://127.0.0.1:9003/account/2FA/

# HEADERS :

{
    'Authorization' : Bearer <AccessToken>
}


# Response (200) OK :

{
    "success": {
        "2FA": false
    }
}

{
    "success": {
        "2FA": true
    }
}

_______________________________________________________________________________






