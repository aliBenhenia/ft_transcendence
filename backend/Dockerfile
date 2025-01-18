FROM python:3.11.8

WORKDIR /server
COPY requirements.txt .
RUN pip install -r requirements.txt

CMD ["sh", "script.sh"]