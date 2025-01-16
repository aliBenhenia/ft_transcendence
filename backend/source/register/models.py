import re, secrets , string
from django.db import models
from django.db.models import Q
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from security.models import SECURITY
from account.models import STATICS
from server.settings import DEFAULT_PICTURE

def generate_token(length=32):
    return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(length))

class RegisterException(Exception):
    pass

class RegisterManager(BaseUserManager):
    def create_user(self, requested):
        if requested.get('provider_id', None) is None:
            self.ValidateRegister(requested)
        fields = {
            'SECURE' : SECURITY.objects.create(),
            'DETAILS' : STATICS.objects.create(),
            'provider_id' : requested.get('provider_id', None),
            'photo_url' : requested.get('photo_url', DEFAULT_PICTURE),
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
        return user

    @staticmethod
    def ValidateRegister(requested, validate=True):
        RegisterManager.ValidateEmail(requested.get('email', None),  validate)
        RegisterManager.ValidateUsername(requested.get('username', None),  validate)
        RegisterManager.ValidatePassword(requested.get('password', None), requested.get('repassword', None),  validate)
        RegisterManager.ValidateName(requested.get('first_name', None), True, validate)
        RegisterManager.ValidateName(requested.get('last_name', None), False,  validate)

    @staticmethod
    def ValidateName(name, state, to_validate):
        if not to_validate and not name:
            return 

        if state:
            if not name:
                raise RegisterException('14')
            if len(name) < 2 or len(name) > 29:
                raise RegisterException('15')
            if not bool(re.match(r'^[A-Za-z]+$', name)):
                raise RegisterException('16')
        else:
            if not name:
                raise RegisterException('17')
            if len(name) < 2 or len(name) > 29:
                raise RegisterException('18')
            if not bool(re.match(r'^[A-Za-z]+$', name)):
                raise RegisterException('19')

    @staticmethod
    def ValidateUsername(username, to_validate):
        if not to_validate and not username:
            return

        if not username:
            raise RegisterException('10')

        if len(username) < 3 or len(username) > 15:
            raise RegisterException('11')

        if not re.match(r'^[a-z0-9_-]+$', username):
            raise RegisterException('12')

        if not re.search(r'[a-z]', username):
            raise RegisterException('12')

        existing_user = Register.objects.filter(Q(username=username)).first()
        if existing_user:
            raise RegisterException("13")

        reserved_usernames = {'admin', 'root', 'superuser'}
        if username in reserved_usernames:
            raise RegisterException("13")

    @staticmethod
    def ValidateEmail(email, to_validate):
        if not to_validate and not email:
            return 

        if not email:
            raise RegisterException("6")
        email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if not re.match(email_regex, email):
            raise EmailValidationError("Invalid email format.")
        if len(email) > 98:
            raise RegisterException("8")
        existing_email = Register.objects.filter(Q(email=email)).first()
        if existing_email:
            raise RegisterException("7")

    @staticmethod
    def ValidatePassword(password, re_password, to_validate):
        if not to_validate and not password and not re_password:
            return

        if not password:
            raise RegisterException("1")
        if not re_password:
            raise RegisterException("4")
        if re_password != password:
            raise RegisterException("5")
        if len(password) < 12:
            raise RegisterException("2")
        if len(password) > 98:
            raise RegisterException("3")
        if not re.search(r'[a-z]', password):
            raise RegisterException("22")
        if not re.search(r'[A-Z]', password):
            raise RegisterException("23")
        if not re.search(r'\d', password):
            raise RegisterException("24")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            raise RegisterException("25")

class Register(AbstractBaseUser):

    last_name = models.CharField(max_length=30)
    first_name = models.CharField(max_length=30)
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=100, null=True)
    photo_url = models.URLField(default=DEFAULT_PICTURE)
    picture = models.ImageField(upload_to='avatars/', default='avatars/unknown.jpeg', blank=True)
    
    is_online = models.BooleanField(default=False)
    SECURE = models.OneToOneField(SECURITY, on_delete=models.CASCADE, null=True)
    DETAILS = models.OneToOneField(STATICS, on_delete=models.CASCADE, null=True)
    
    token_chat = models.CharField(max_length=60, unique=True, blank=True)
    token_notify = models.CharField(max_length=60, unique=True, blank=True)
    token_game = models.CharField(max_length=60, blank=True, null=True,default='')
    
    ACCOUNT = models.CharField(max_length=20, default='NORMAL')
    USERNAME_FIELD = 'email'

    provider_id = models.BigIntegerField(null=True)
    
    objects = RegisterManager()

    def __str__(self):
        return self.email
