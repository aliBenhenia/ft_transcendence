# Generated by Django 5.0.6 on 2025-01-04 11:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('register', '0014_alter_register_photo_url_alter_register_picture'),
    ]

    operations = [
        migrations.AlterField(
            model_name='register',
            name='photo_url',
            field=models.URLField(default='http://10.13.2.16:9003/media/avatars/unknown.jpeg'),
        ),
    ]