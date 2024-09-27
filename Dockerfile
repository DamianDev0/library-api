# Usa la imagen oficial de Node.js
FROM node:18

# Crea y utiliza el directorio de la aplicación
WORKDIR /app

# Copia los archivos del proyecto a /app
COPY . .

# Instala las dependencias
RUN npm install

# Expone el puerto 3000
EXPOSE 3000

# Comando por defecto
CMD ["npm", "run", "start:dev"]
