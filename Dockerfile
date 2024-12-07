FROM node:20-slim

WORKDIR /app

COPY *.json .

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 80

CMD [ "npm", "start" ]