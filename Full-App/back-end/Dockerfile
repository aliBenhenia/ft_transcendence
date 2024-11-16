FROM python:3.11.8

WORKDIR /server-api

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt /server-api
RUN pip install -r requirements.txt

VOLUME /server-api

# Expose port 8000 for the application
EXPOSE 8000

# Command to run your application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
#CMD ["daphne", "-b", "0.0.0.0", "-p", "6000", "server_api.asgi:application"]

