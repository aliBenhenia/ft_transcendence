from register.models import Register

def AccountLookup(account):
    try:
        return (Register.objects.get(username=account), True)
    except:
        try:
            return (Register.objects.get(email=account), True)
        except:
            return (None, False)