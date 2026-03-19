FROM node:20-alpine

WORKDIR /app

COPY Funcionalidad/package*.json ./
RUN npm install --production

COPY Funcionalidad/ ./
COPY Interfaz/ ./public/

EXPOSE 8080

CMD ["node", "server.js"]