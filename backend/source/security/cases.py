SUCCESS_MSG = {

    "1" : "A verification code has been sent to your email. Please check your inbox and enter the code to proceed.",
    
    # RESET PASSWORD CASES 
    
    "2" : "Access granted. You can now change your password.",
    "5" : "Password changed successfully, You can now log in with your new password",
    "6" : "you can now change your password",

    # 2FA CASES
    
    "3" : "Your 2FA code has been verified successfully. You can now access your account.",
    "4" : "Two-Factor Authentication (2FA) code has been sent to your email. Please check your inbox and enter the 2FA code to access your account.",

}

ERROR_MSG = {

    # RESET PASSWORD CASES 

    "1" : "We couldn't find an account matching the provided information. Please double-check your username or email address and try again.",
    "2" : "Retry limit reached. Please wait ",
    "3" : "Invalid Verification code, Please try again .",
    "4" : "Invalid Verification code, Please enter a numeric code.",
    
    # 2FA CASES

    "5" : "Authentication failed. Please check the 2FA code and try again.",
    "6" : 'Two-Factor Authentication (2FA) is required.',
    "7" : 'The 2FA code you entered is incorrect. Please try again.',

    # TOKEN CASES

    "8" : "The provided token is not recognized or is malformed.",
    "9" : "The token has reached its expiration time and is no longer valid.",

    # VALIDATE PASSWORD CASES 
    
    "10": 'Password is required: The password field is left blank.',
    "11": 'Password too short: The password does not meet the minimum length requirement.',
    "12": 'Password too long: The password exceeds the maximum allowed length.',
    "13": 'Re-Password is required: The re password field is left blank.',
    "14": 'Password confirmation does not match: The confirmation password does not match the original password.',
    "15" : "you cannot change your password with old one, try again",

    # 

    "16" : "Not Valid Request Make sure that you provided the username or email correctly !"
}