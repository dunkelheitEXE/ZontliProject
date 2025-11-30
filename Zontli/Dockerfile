FROM node:22-alpine as build-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build --prod

FROM nginx:1.27-alpine

COPY --from=build-step /app/dist/Zontli/browser /usr/share/nginx/html
