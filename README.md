# 📞 API Contact Manager

Une API REST complète pour la gestion de contacts avec authentification JWT et sécurisation des routes. Cette application permet aux utilisateurs de s'inscrire, se connecter et gérer leurs contacts personnels de manière sécurisée.

## 🚀 Fonctionnalités

### 👥 Gestion des Utilisateurs
- ✅ **Inscription** : Création de nouveaux comptes utilisateurs
- ✅ **Connexion** : Authentification avec JWT
- ✅ **Profil** : Consultation des informations utilisateur
- ✅ **Sécurité** : Hachage des mots de passe avec bcrypt

### 📋 Gestion des Contacts
- ✅ **CRUD complet** : Créer, Lire, Modifier, Supprimer des contacts
- ✅ **Contacts privés** : Chaque utilisateur ne peut accéder qu'à ses propres contacts
- ✅ **Validation** : Tous les champs sont validés (nom, email, téléphone)
- ✅ **Autorisation** : Vérification des droits d'accès pour chaque opération

## 🛠️ Technologies Utilisées

- **Backend** : Node.js + Express.js
- **Base de données** : MongoDB avec Mongoose
- **Authentification** : JSON Web Tokens (JWT)
- **Sécurité** : bcrypt pour le hachage des mots de passe
- **Middleware** : express-async-handler pour la gestion des erreurs asynchrones
- **Environment** : dotenv pour la gestion des variables d'environnement

## 📁 Structure du Projet

```
api-contact-manager/
├── app.js                    # Point d'entrée de l'application
├── package.json              # Dépendances et scripts
├── constants.js              # Constantes pour les codes d'erreur HTTP
├── config/
│   └── dbConnect.js          # Configuration de la base de données MongoDB
├── controllers/
│   ├── contactControllers.js # Logique métier pour les contacts
│   └── userControllers.js    # Logique métier pour les utilisateurs
├── middleware/
│   ├── errorhandler.js       # Gestion centralisée des erreurs
│   └── validateToken.js      # Validation des tokens JWT
├── models/
│   ├── contactModel.js       # Modèle Mongoose pour les contacts
│   └── userModel.js          # Modèle Mongoose pour les utilisateurs
└── routes/
    ├── contactRouters.js     # Routes pour les contacts
    └── userRouters.js        # Routes pour les utilisateurs
```

## ⚙️ Installation et Configuration

### 1. Cloner le projet
```bash
git clone <url-du-projet>
cd api-contact-manager
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration des variables d'environnement
Créer un fichier `.env` à la racine du projet :
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/contact-manager
JWT_SECRET=votre_jwt_secret_très_sécurisé
NODE_ENV=development
```

### 4. Démarrer l'application
```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

L'API sera accessible sur `http://localhost:3000`

## 📚 Documentation de l'API

### 🔐 Authentification

#### Inscription
```http
POST /user/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "motdepasse123"
}
```

#### Connexion
```http
POST /user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "motdepasse123"
}
```

**Réponse** :
```json
{
  "id": "user_id",
  "email": "john@example.com",
  "username": "johndoe",
  "accessToken": "jwt_token_here"
}
```

#### Profil utilisateur (protégé)
```http
GET /user/current
Authorization: Bearer <jwt_token>
```

### 📞 Gestion des Contacts (Routes protégées)

> **Note** : Toutes les routes de contacts nécessitent un token JWT dans l'en-tête Authorization.

#### Récupérer tous les contacts
```http
GET /contact/all
Authorization: Bearer <jwt_token>
```

#### Récupérer un contact spécifique
```http
GET /contact/get/:id
Authorization: Bearer <jwt_token>
```

#### Ajouter un nouveau contact
```http
POST /contact/add
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+33123456789"
}
```

#### Modifier un contact
```http
PUT /contact/update/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+33987654321"
}
```

#### Supprimer un contact
```http
DELETE /contact/delete/:id
Authorization: Bearer <jwt_token>
```

## 🔒 Sécurité

### Middleware de Validation de Token
- Vérifie la présence du token JWT dans l'en-tête `Authorization`
- Valide la signature du token avec la clé secrète
- Extrait les informations utilisateur du token
- Protège toutes les routes de contacts

### Autorisation
- Chaque utilisateur ne peut accéder qu'à ses propres contacts
- Vérification de l'ID utilisateur pour chaque opération CRUD
- Messages d'erreur appropriés pour les accès non autorisés

### Gestion des Erreurs
- **400** : Erreur de validation (champs manquants, format invalide)
- **401** : Non autorisé (token manquant ou invalide)
- **403** : Accès interdit
- **404** : Ressource non trouvée
- **500** : Erreur serveur

## 🗄️ Modèles de Données

### Utilisateur
```javascript
{
  username: String (requis),
  email: String (requis, unique),
  password: String (requis, haché),
  timestamps: true
}
```

### Contact
```javascript
{
  user_id: ObjectId (requis, référence vers User),
  name: String (requis),
  email: String (requis),
  phone: String (requis),
  created_at: Date (par défaut: Date.now)
}
```

## 🚀 Scripts Disponibles

```bash
npm start      # Démarrer en mode production
npm run dev    # Démarrer en mode développement avec nodemon
npm test       # Lancer les tests (à configurer)
```

## 🧪 Test de l'API

Vous pouvez tester l'API avec des outils comme :
- **Postman** : Collection disponible pour import
- **Insomnia** : Client REST moderne
- **cURL** : Ligne de commande
- **Thunder Client** : Extension VS Code

### Exemple de test avec cURL
```bash
# 1. S'inscrire
curl -X POST http://localhost:3000/user/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"123456"}'

# 2. Se connecter
curl -X POST http://localhost:3000/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# 3. Ajouter un contact (remplacer TOKEN par le token reçu)
curl -X POST http://localhost:3000/contact/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"123456789"}'
```

## 🤝 Contribution

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Notes Techniques

### Middleware Express
- **express.json()** : Parse automatiquement le JSON des requêtes
- **validateToken** : Middleware custom pour l'authentification JWT
- **errorHandler** : Gestion centralisée des erreurs avec codes HTTP appropriés

### Sécurité JWT
- Token expirant après 10 minutes
- Signature avec clé secrète stockée dans les variables d'environnement
- Inclusion des informations utilisateur dans le payload

### Base de Données
- Connexion MongoDB avec Mongoose
- Modèles avec validation automatique
- Relations entre utilisateurs et contacts via ObjectId

## 🐛 Dépannage

### Erreurs Communes
1. **Error: Invalid ID format** : L'ID fourni n'est pas un ObjectId MongoDB valide
2. **User already exists** : Email déjà utilisé lors de l'inscription
3. **Not authorized** : Token JWT manquant ou invalide
4. **Contact not found** : ID de contact inexistant ou appartenant à un autre utilisateur

### Logs
L'application affiche des logs détaillés pour :
- Connexion à la base de données
- Démarrage du serveur
- Erreurs de validation et d'authentification

## 📄 Licence

Ce projet est sous licence ISC.

---

**Développé avec ❤️ en Node.js + Express + MongoDB**
