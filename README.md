# 🚀 Déploiement du Planning Dashboard

Ce projet est structuré pour être déployé facilement sur **Vercel** (Client) et **Render** (Serveur).

## 📂 Structure
- `client/` : Application Front-end (HTML/JS/CSS). À déployer sur Vercel.
- `server/` : Serveur Node.js (Express). À déployer sur Render.

---

## 1️⃣ Déploiement Client sur Vercel (Recommandé)
Le client est une application statique (SPA).

1. Poussez ce code sur GitHub.
2. Allez sur [Vercel](https://vercel.com) et faites "Add New Project".
3. Importez votre dépôt GitHub.
4. **IMPORTANT** : Dans "Root Directory", cliquez sur "Edit" et sélectionnez le dossier `client`.
5. Cliquez sur "Deploy".

*Note : Un fichier `vercel.json` est inclus dans `client/` pour gérer les redirections SPA.*

---

## 2️⃣ Déploiement Serveur sur Render
Le serveur sert l'application et pourra gérer de futures API.

1. Allez sur [Render](https://render.com).
2. Cliquez sur "New +" -> "Blueprint".
3. Connectez votre dépôt GitHub.
4. Render détectera automatiquement le fichier `render.yaml` à la racine.
5. Cliquez sur "Apply".

---

## 🛠️ Développement Local
Pour lancer le projet en local avec le serveur :

1. Ouvrez un terminal.
2. Allez dans le dossier serveur : `cd planning-dashboard/server`
3. Installez les dépendances : `npm install`
4. Lancez le serveur : `npm start`
5. Ouvrez `http://localhost:3000`
