# Estagio 1: Build da aplicacao React/Vite
FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_API_URL=http://localhost:8000/api
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_GOOGLE_USERINFO_URL

ENV VITE_API_URL=$VITE_API_URL \
    VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID \
    VITE_GOOGLE_USERINFO_URL=$VITE_GOOGLE_USERINFO_URL

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

RUN rm -rf /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]