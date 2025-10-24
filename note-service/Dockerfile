FROM node:18-alpine
WORKDIR /app
#для установки зависимостей
COPY package*.json ./
RUN npm install
#остальные файлы
COPY . .
#открываем порт
EXPOSE 3001
CMD ["node", "index.js"]