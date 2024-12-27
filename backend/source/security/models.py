from django.db import models
from datetime import timedelta
from django.utils import timezone
import random, datetime, secrets , string


RETRY_MINUTE = 1
LIMITED_RETRY = 3
TOKEN_EXPIRE_TIME = 5

class SECURITY(models.Model):

    # VERIFY 2FA #
    code_2fa = models.IntegerField(default=0)
    activate = models.BooleanField(default=False)
    on_login = models.BooleanField(default=False)

    # PASSWORD RESET #

    code = models.IntegerField(default=0)
    token_time = models.DateTimeField(null=True, blank=True)
    token = models.CharField(max_length=61, unique=True, null=True, blank=True)

    # LIMIT SETUP #
    
    send_counter = models.IntegerField(default=0)
    retry_counter = models.IntegerField(default=0)
    retry_time = models.DateTimeField(null=True, blank=True)

    def token_setup(self):
        self.token_time =  timezone.now() + timedelta(minutes=TOKEN_EXPIRE_TIME)
        self.token = self.generate_token(60)
        self.save()
        return self.token
    
    def on_state(self):
        self.token = None
        self.token_time = None
        self.save()
    
    def verify_token(self):
        now = self.convert_to_datetime(timezone.now())
        on_check = self.convert_to_datetime(self.token_time)
        if now < on_check:
            return True
        self.on_state()
        return False

    def verify(self, check):
        if check == self.code and self.code != 0:
            self.reset()
            return True
        return False

    def send_code(self, state):
        if state:
            self.code = random.randint(100000, 999999)
            print('code : ', self.code)
        else:
            self.code_2fa = random.randint(100000, 999999)
            print('code : ', self.code_2fa)
        self.save()

    def convert_to_datetime(self, time):
        if not time:
            return None
        string = time.strftime('%Y-%m-%d %H:%M:%S')
        return datetime.datetime.strptime(string, '%Y-%m-%d %H:%M:%S')

    def can_retry(self, state):

        remaining_time = "01:00"
        now = self.convert_to_datetime(timezone.now())
        on_check = self.convert_to_datetime(self.retry_time)

        if on_check:
            if now > on_check:
                if state:
                    return True, self.reset_2fa()
                return True, self.reset()

            remaining_time = on_check - now
        return False, f"{remaining_time}"

    def on_time(self):
        if not self.retry_time:
            self.set_retry_timer()
            self.save()
    
    def processing(self, state):
        if state:
            if self.send_counter >= LIMITED_RETRY or self.retry_counter >= LIMITED_RETRY:
                self.on_time()
                return True
            self.send_counter += 1
        else:
            if self.retry_counter >= LIMITED_RETRY or self.send_counter >= LIMITED_RETRY:
                self.on_time()
                return True
            self.retry_counter += 1
        self.save()
        return False

    def reset(self):
        self.code = 0
        self.send_counter = 0
        self.retry_counter = 0
        self.retry_time = None
        self.save()

    #  METHODS FOR 2FA  #

    def login(self, status):
        self.on_login = status
        self.save()

    def activate_2FA(self, status):
        self.activate = status
        self.save()

    def verify_otp(self, code=None):
        if code == self.code_2fa and self.code_2fa != 0:
            self.reset_2fa()
            return True
        return False

    def reset_2fa(self):
        self.send_counter = 0
        self.retry_counter = 0
        self.retry_time = None
        self.save()

    def set_retry_timer(self):
        self.retry_time = timezone.now() + timedelta(minutes=RETRY_MINUTE)
        self.save()
    
    def generate_token(self, length=32):
        return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(length))

