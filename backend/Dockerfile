FROM python:3.11.8

WORKDIR /server

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt /server
COPY /source /server
RUN pip install -r requirements.txt

VOLUME /server

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8001"]