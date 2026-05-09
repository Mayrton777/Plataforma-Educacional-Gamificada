# Build
FROM node:20-alpine AS build
WORKDIR /app

# Instala as dependências
COPY package.json package-lock.json ./
RUN npm install

# Copia o código e faz o build do Vite
COPY . .
RUN npm run build

# Servidor Web Nginx
FROM nginx:alpine
# Copia os arquivos compilados do React para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuração pro Nginx entender as rotas do React Router
RUN echo "server { listen 80; location / { root /usr/share/nginx/html; try_files \$uri /index.html; } }" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]