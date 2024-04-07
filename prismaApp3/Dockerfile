# Dockerfile pour le service User

# Utiliser une image de base avec Node.js
FROM node:latest

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Exposer le port sur lequel l'API fonctionne
EXPOSE 3002

# Commande pour démarrer l'application
CMD ["npm", "start"]
