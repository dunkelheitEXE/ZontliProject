FROM node:alpine AS build-stage

RUN mkdir -p /server
WORKDIR /server
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
