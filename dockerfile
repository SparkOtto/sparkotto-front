# Étape 1 : Build de l'application Next.js
FROM node:lts-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

# Étape 2 : Exécution en production
FROM node:lts-alpine

WORKDIR /app

COPY --from=build /app /app

EXPOSE 3000

CMD ["npm", "run", "start"]