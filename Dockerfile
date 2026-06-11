FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

CMD ["serve", "-s", "public", "-l", "3000"]
