FROM node:18

WORKDIR /app
RUN touch .env
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod +x script.sh
CMD ["sh", "script.sh"]