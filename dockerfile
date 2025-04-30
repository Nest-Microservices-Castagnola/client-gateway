FROM node:22-slim

WORKDIR /usr/src/app

COPY package*.json ./

# Actualiza npm y usa un registro rápido
RUN npm install -g npm@10.5.0 \
    && npm config set registry https://registry.npmmirror.com/ \
    && npm ci --no-audit --no-optional --legacy-peer-deps


COPY . .

EXPOSE 3000
