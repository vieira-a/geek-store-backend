# Use uma imagem base do Node.js
FROM node:16

WORKDIR /app

COPY ./geek-store-backend/package*.json ./

RUN npm install

COPY ./geek-store-backend ./

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
