# Generated by Django 5.0.6 on 2025-01-04 20:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('register', '0016_alter_register_photo_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='register',
            name='photo_url',
            field=models.URLField(default='http://localhost:9003/media/avatars/unknown.jpeg'),
        ),
    ]