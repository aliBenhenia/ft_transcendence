# Generated by Django 5.0.6 on 2024-09-29 15:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('register', '0009_register_photo_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='register',
            name='ACCOUNT',
            field=models.CharField(default='NORMAL', max_length=20),
        ),
    ]
