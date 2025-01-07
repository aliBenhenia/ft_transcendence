from register.models import Register

def ValidatePassword(password=None, repassword=None):
    if not password:
        return "10"
    if len(password) < 6:
        return "11"
    if len(password) > 98:
        return "12"
    if not repassword:
        return "13"
    if repassword != password:
        return "14"
    return None

def AccountLookup(account):
    try:
        return (Register.objects.get(username=account), True)
    except:
        try:
            return (Register.objects.get(email=account), True)
        except:
            return (None, False)