import re, secrets , string
from django.db import models
from django.db.models import Q
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from security.models import SECURITY
from account.models import STATICS
from server.settings import FULL_PICTURE

def generate_token(length=32):
    return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(length))

class RegisterException(Exception):
    pass

class RegisterManager(BaseUserManager):
    def create_user(self, requested):
        if requested.get('provider_id', None) is None:
            self.ValidateRegister(requested)
        
        SEC = SECURITY.objects.create()
        SEC.save()

        fields = {
            'SECURE' : SEC,
            'provider_id' : requested.get('provider_id', None),
            'photo_url' : requested.get('photo_url', FULL_PICTURE),
            'username': requested.get('username'),
            'password' :  requested.get('password'),
            'last_name': requested.get('last_name'),
            'first_name': requested.get('first_name'),
            'email':  self.normalize_email(requested.get('email')),
            'token_notify' : generate_token(length=38),
            'token_chat' : generate_token(length=38),
        }

        user = self.model(**fields)
        user.set_password(fields['password'])
        user.save()

        OBJECT = STATICS.objects.create()
        OBJECT.rank = user.id
        OBJECT.save()
        
        user.DETAILS = OBJECT
        user.save()
        return user
    
    def ValidateRegister(self, requested):
    
        email = requested.get('email')
        self.ValidateEmail(email)
        
        username = requested.get('username')
        self.ValidateUsername(username)

        password = requested.get('password')
        re_password = requested.get('repassword')
        self.ValidatePassword(password, re_password)

        first_name = requested.get('first_name')
        self.ValidateName(first_name, True)
         
        last_name = requested.get('last_name')
        self.ValidateName(last_name, False)

    
    def ValidateName(self, name, state):
        if state:

            if not name:
                raise RegisterException('14')
            if len(name) > 29:
                raise RegisterException('15')
            if not bool(re.match(r'^[A-Za-z]+$', name)):
                raise RegisterException('16')
        else:
            if not name:
                raise RegisterException('17')
            if len(name) > 29:
                raise RegisterException('18')
            if not bool(re.match(r'^[A-Za-z]+$', name)):
                raise RegisterException('19')

    def ValidateUsername(self, username):
        if not username:
            raise RegisterException('10')
        if len(username) > 29:
            raise RegisterException('11')
        if not bool(re.match(r'^[a-z0-9_-]+$', username)):
            raise RegisterException('12')
        existing_user = self.model.objects.filter(Q(username=username)).first()
        if existing_user:
            raise RegisterException("13")
    
    def ValidateEmail(self, email):
        if not email:
            raise RegisterException("6")
        existing_user = self.model.objects.filter(Q(email=email)).first()
        if existing_user:
            raise RegisterException("7")
        if len(email) > 98:
            raise RegisterException("8")
    
    def ValidatePassword(self, password, re_password):
        if not password:
            raise RegisterException("1")
        if len(password) < 6:
            raise RegisterException("2")
        if len(password) > 98:
            raise RegisterException("3")
        if not re_password:
            raise RegisterException("4")
        if re_password != password:
            raise RegisterException("5")

class Register(AbstractBaseUser):

    last_name = models.CharField(max_length=30)
    first_name = models.CharField(max_length=30)
    
    email = models.EmailField(max_length=100, unique=True)
    username = models.CharField(max_length=30, unique=True)
    
    password = models.CharField(max_length=100, null=True)
    
    is_online = models.BooleanField(default=False)

    token_chat = models.CharField(max_length=60, unique=True, blank=True)
    token_notify = models.CharField(max_length=60, unique=True, blank=True)
    token_game = models.CharField(max_length=60, blank=True, null=True,default='')

    photo_url = models.URLField(default=FULL_PICTURE)
    picture = models.ImageField(upload_to='avatars/', default='avatars/unknown.jpeg', blank=True)

    SECURE = models.OneToOneField(SECURITY, on_delete=models.CASCADE, null=True)
    DETAILS = models.OneToOneField(STATICS, on_delete=models.CASCADE, null=True)

    ACCOUNT = models.CharField(max_length=20, default='NORMAL')
    
    USERNAME_FIELD = 'email'

    provider_id = models.BigIntegerField(null=True)
    
    objects = RegisterManager()

    def __str__(self):
        return self.email
