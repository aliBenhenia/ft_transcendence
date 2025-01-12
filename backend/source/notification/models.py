from django.db import models
from django.utils import timezone
from register.models import Register

class NOTIFY(models.Model):

    
    sender = models.ForeignKey(Register, related_name='send_notifications', on_delete=models.CASCADE)
    account = models.ForeignKey(Register, related_name='recive_notifications', on_delete=models.CASCADE)

    mark = models.BooleanField(default=False)
    content = models.CharField(default='NONE', max_length=20)
    time = models.DateTimeField(null=True, blank=True, default=timezone.now)

    class Meta:
        ordering = ['-time']
    def mark_as_read(self):
        self.mark = True
        self.save()


