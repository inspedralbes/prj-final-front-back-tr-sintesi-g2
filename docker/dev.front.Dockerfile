FROM node:18-alpine

# Ruta de trabajo más clara
WORKDIR /app

# Copiar solo package.json y lock para mejor caching
COPY vuetify-project/package*.json ./vuetify-project/

# Ir al directorio correcto e instalar
WORKDIR /app/vuetify-project
RUN npm install

# Copiar el resto del proyecto
COPY vuetify-project/. .

# No necesitas nodemon en el frontend, salvo que estés haciendo otra cosa
# RUN npm install -g nodemon  ❌ innecesario aquí

EXPOSE 4000

CMD ["npm", "run", "dev"]
