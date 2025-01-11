FROM nginx:latest


RUN apt-get update && apt-get install -y openssl
RUN mkdir -p /etc/nginx/ssl
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
-keyout /etc/nginx/ssl/private.key \
-out /etc/nginx/ssl/certificate.crt \
-subj "/C=MA/ST=State/L=Khouribga/O=1337/CN=localhost"

COPY ./nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
