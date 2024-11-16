from datetime import timedelta, datetime, timezone
from django.db import models
from .models import Register
import random

##################################  [OK] ##################################


LIMITED_SEND_CODE = 3
LIMITED_RETRY_CODE = 3

# timedelta(hours=1) 
class Security(models.Model):
    
    client = models.OneToOneField(Register, on_delete=models.CASCADE, null=True)

    code = models.IntegerField(default=0)

    retry_counter = models.IntegerField(default=0)
    send_counter = models.IntegerField(default=0)

    send_retry_time = models.DateTimeField(null=True, blank=True)
    verify_retry_time = models.DateTimeField(null=True, blank=True)

    def verify(self, check=None):
        if not isinstance(check, int):
            return False
        if check != None and check == self.code:
            self.completed()
            return True
        return False

    def set_code(self):
        self.code = random.randint(100000, 999999)
        self.save()
        print('CODE RESET : [', self.code, ']')
    
    def processing_send(self):
        print('[counter] : ', self.send_counter)
        if self.send_counter >= LIMITED_SEND_CODE:
            if self.send_retry_time == None:
                self.send_retry_time = datetime.now() + timedelta(minutes=1)
                self.save()
            return True
        else:
            self.send_counter += 1
            self.save()
        return False
    
    def processing_retry(self):
        if self.retry_counter > LIMITED_RETRY_CODE:
            if self.verify_retry_time == None:
                self.verify_retry_time = datetime.now() + timedelta(minutes=1)
                self.save()
            return True
        else:
            self.retry_counter += 1
            self.save()
        return False

    def completed(self):
        self.code = 0
        self.retry_counter = 0
        self.send_counter = 0
        self.verify_retry_time = None
        self.send_retry_time = None
        self.save()

    def can_verify(self):
        print('[on verify] : ', self.verify_retry_time.replace(tzinfo=None))
        print('[time now] : ', datetime.now())
        if self.verify_retry_time and datetime.now() < self.verify_retry_time.replace(tzinfo=None):
            return False
        self.completed()
        return True
    
    def can_retry(self):
        print('[on retry] : ', self.send_retry_time.replace(tzinfo=None))
        print('[time now] : ', datetime.now())
        if self.send_retry_time and datetime.now() < self.send_retry_time.replace(tzinfo=None):
            return False
        self.completed()
        return True






'''

datetime.now() < self.retry_time

TypeError: can't compare offset-naive and offset-aware datetimes

This occurs when you're trying to compare two datetime objects: 
one that is offset-naive (without timezone information) and another that is offset-aware (with timezone information).
To fix this, you need to ensure both datetimes are either timezone-aware or timezone-naive.

'''