FROM node:20-slim

WORKDIR /app/server

COPY ../*.json /app/

RUN cd /app && npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]