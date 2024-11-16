from .models import NOTIFY

def create_notification(sender, reciver, subject):
    if not sender or not reciver:
        return False
    obj = NOTIFY.objects.create(sender=sender, account=reciver, content=subject)
    obj.save()
    return obj
    