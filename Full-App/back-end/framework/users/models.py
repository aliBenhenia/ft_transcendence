from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.db import models
from datetime import timedelta, datetime
from friends.models import FriendsList, FriendsRequest

##################################  [OK] ##################################

LIMITED_OTP = 30

PLAYER_STATE = [
    ('active', 'Active'),
    ('inactive', 'Inactive'),
    ('playing', 'Playing'),
]

LEVEL = [
    (str(i), i) for i in range(1, 11)
]

ACHIEVEMENTS = ['Bronze','Silver', 'Gold','Platinum','Diamond','Master','Grandmaster','Challenger','Legend', 'Mythic']

class RegisterManager(BaseUserManager):
    create_superuser_manager_method = False

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

class Register(AbstractBaseUser):
    
    email = models.EmailField(max_length=150, unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)

    account = models.CharField(max_length=150, blank=True, default='normal')
    activate_token = models.CharField(max_length=150, blank=True)

    is_online = models.BooleanField(default=False)

    is_active = models.BooleanField(default=False)
    password = models.CharField(max_length=180)


    username = models.CharField(max_length=150, unique=True, null=True, blank=True)

    token_game = models.CharField(max_length=60, blank=True, default='')
    token_notify = models.CharField(max_length=40, unique=True, blank=True)
    token_chat = models.CharField(max_length=40, unique=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = RegisterManager()

    def __str__(self):
        return self.email

    
class Profile_Security(models.Model):
    
    otp = models.BooleanField(default=False)
    on_login = models.BooleanField(default=False)
    
    code_2fa = models.IntegerField(default=0)
    retry_later = models.IntegerField(default=0)

    next_retry_time = models.DateTimeField(null=True, blank=True)

    # On Login Verification
    def OnLogin(self, status):
        if status:
            self.on_login = True
        else:
            self.on_login = False
        self.save()

    # Activate OTP
    def OTP(self, status):
        if status:
            self.otp = True
        else:
            self.otp = False
        self.save()
    
    # Verify OTP
    def verify_otp(self, code=None):
        return code != None and code == self.code_2fa

    # Update the Setting For Limit
    def verify_retry(self):
        if self.retry_later >= LIMITED_OTP:
            if self.next_retry_time == None:
                self.next_retry_time = datetime.now() + timedelta(hours=1)
                self.save()
            return True
        else:
            self.retry_later += 1
            self.save()
        return False

    # Reset setting After Verification
    def otp_completed(self):
        self.code_2fa = 0
        self.retry_later = 0
        self.next_retry_time = None
        self.on_login = False
        self.save()

    # Check if the user can Retry After reach the Limit
    def can_retry_otp(self):
        if self.next_retry_time and datetime.now() < self.next_retry_time:
            return False
        self.retry_later = 0
        self.save()
        return True

class Profile(models.Model):
    client = models.OneToOneField(Register, on_delete=models.CASCADE, null=True)
    secutity = models.OneToOneField(Profile_Security, on_delete=models.CASCADE, null=True)

    win = models.IntegerField(default=0)
    loss = models.IntegerField(default=0)
    rank = models.IntegerField(default=0)
    t_match = models.IntegerField(default=0)
    url_picture = models.URLField(max_length=40, null=True)
    level = models.CharField(max_length=2, choices=LEVEL, default='1')
    achievements = models.CharField(max_length=150, default='Bronze')
    avatar = models.ImageField(upload_to='avatars/', default='avatars/unknown.jpg', blank=True)
    xp_total = models.IntegerField(default=0)

    list = models.OneToOneField(FriendsList, on_delete=models.CASCADE, null=True)
    #request = models.ManyToManyField(FriendsRequest)

    def player_update(self, lvl):
        self.level = str(lvl)
        self.achievements = ACHIEVEMENTS[lvl - 1][1] 

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "Profile"
