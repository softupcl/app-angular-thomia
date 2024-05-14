# Dependencias
FROM node:21-alpine3.19  as deps
WORKDIR /app

COPY package*.json ./
COPY package-lock.json ./

RUN npm install


# Builder - Cnstruindo la aplicacion
FROM node:21-alpine3.19  as build
WORKDIR /app

# Copiar las dependencias
COPY --from=deps /app/node_modules ./node_modules

# Copiar todo el codigo fuente
COPY . .

RUN npm run build

# Dejar solo dependencias de produccion
RUN npm ci -f --only=production && npm cache clean --force



# Crear la imagen final de docker
FROM nginx:latest as prod
EXPOSE 80

COPY --from=build /app/dist/angular-gpt/browser /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/mime.types

COPY nginx/nginx.conf /etc/nginx/conf.d
COPY nginx/mime.types /etc/nginx

CMD [ "nginx","-g", "daemon off;" ]

