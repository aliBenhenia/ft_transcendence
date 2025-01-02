import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from register.models import Register

#record = Register.objects.get(id=8)
record = Register.objects.get(ACCOUNT='42')       
record.delete()
