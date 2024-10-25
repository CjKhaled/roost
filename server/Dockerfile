FROM node:20-slim

WORKDIR /app/server

COPY ../*.json /app/

RUN cd /app && npm install

COPY . .

CMD [ "npm", "start" ]