FROM node:18-slim

WORKDIR /app

COPY /package.json .

RUN npm install --no-optional

# RUN npm install --only=development

RUN npm install sharp

COPY . .

EXPOSE 3000

CMD [ "node", "server.js" ]
