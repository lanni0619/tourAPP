FROM node:18-slim
# Why use version 13.x ?

WORKDIR /app

COPY package.json .

RUN npm install --no-optional

# RUN npm install --only=development

RUN npm install sharp

COPY . .

EXPOSE 80

CMD [ "node", "server.js" ]