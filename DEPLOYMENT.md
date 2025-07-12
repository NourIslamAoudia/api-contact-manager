# 🚀 Guide de Déploiement Vercel

## Étapes pour déployer votre API Contact Manager sur Vercel

### 1. Prérequis
- [ ] Compte GitHub
- [ ] Compte Vercel (gratuit)
- [ ] Base de données MongoDB Atlas (gratuite)

### 2. Préparation de la base de données MongoDB Atlas

1. **Créer un cluster MongoDB Atlas** :
   - Allez sur [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Créez un compte gratuit
   - Créez un nouveau cluster (choisissez la version gratuite M0)

2. **Configurer l'accès** :
   - Dans "Database Access", créez un utilisateur avec lecture/écriture
   - Dans "Network Access", ajoutez `0.0.0.0/0` pour autoriser toutes les IP

3. **Obtenir la chaîne de connexion** :
   - Cliquez sur "Connect" → "Connect your application"
   - Copiez la chaîne de connexion
   - Exemple : `mongodb+srv://username:password@cluster0.abc123.mongodb.net/contact_manager?retryWrites=true&w=majority`

### 3. Déploiement sur Vercel

1. **Préparer le repository** :
   ```bash
   git add .
   git commit -m "Prêt pour le déploiement Vercel"
   git push origin main
   ```

2. **Importer le projet dans Vercel** :
   - Allez sur [Vercel](https://vercel.com)
   - Cliquez sur "New Project"
   - Importez votre repository GitHub
   - Vercel détectera automatiquement que c'est un projet Node.js

3. **Configurer les variables d'environnement** :
   Dans les paramètres de votre projet Vercel, ajoutez :
   ```
   MONGO_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/contact_manager?retryWrites=true&w=majority
   ACCESS_TOKEN_SECRET=votre_clé_secrète_jwt_minimum_32_caractères_très_sécurisée
   NODE_ENV=production
   ```

4. **Déployer** :
   - Cliquez sur "Deploy"
   - Attendez que le déploiement se termine (environ 1-2 minutes)

### 4. Tester votre API déployée

Une fois déployée, votre API sera accessible à une URL comme `https://votre-nom-api.vercel.app`

**Tests basiques** :
```bash
# Test de santé
curl https://votre-nom-api.vercel.app/health

# Test de la route principale
curl https://votre-nom-api.vercel.app/

# Test d'inscription
curl -X POST https://votre-nom-api.vercel.app/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 5. Utilisation de l'API

Votre API est maintenant prête à être utilisée ! Vous pouvez :

- **Partager l'URL** avec d'autres développeurs
- **L'utiliser dans vos applications frontend** (React, Vue, Angular, etc.)
- **L'intégrer dans des applications mobiles**
- **La documenter avec Postman** ou Swagger

### 6. Mise à jour automatique

Chaque fois que vous pousserez du code sur la branche `main` de votre repository GitHub, Vercel redéploiera automatiquement votre API !

### 7. Surveillance et logs

- Consultez les logs dans le dashboard Vercel
- Surveillez les performances et les erreurs
- Activez les notifications en cas de problème

---

## 🎉 Félicitations !

Votre API Contact Manager est maintenant déployée et accessible publiquement ! 

**Prochaines étapes suggérées** :
- [ ] Créer une documentation API avec Swagger
- [ ] Ajouter des tests automatisés
- [ ] Mettre en place un monitoring
- [ ] Créer un frontend pour interagir avec l'API
