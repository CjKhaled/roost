FROM node:20-slim

RUN apt-get update -y && \
    apt-get install -y openssl && \
    apt-get install -y libssl-dev

WORKDIR /app

COPY *.json .

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 80

CMD [ "npm", "start" ]