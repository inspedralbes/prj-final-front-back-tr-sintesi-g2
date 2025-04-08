FROM node:18-alpine

WORKDIR /app/frontend/vuetify-project

COPY ./vuetify-project/package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm install -g nodemon

CMD ["npm", "run", "dev"]
