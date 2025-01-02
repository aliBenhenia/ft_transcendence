#!/bin/sh

python /server/manage.py makemigrations
python /server/manage.py migrate
python /server/manage.py runserver 0.0.0.0:8001