import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from register.models import Register

DATA = {
    "username" : 'areifoun',
    "email" : 'abc6132@mail.com',
    "first_name" : 'Ayman',
    "last_name" : 'Reifoun',
    "password" : '111111',
    "repassword" : '111111',
}

obj = Register.objects.create_user(DATA)
obj.save()

