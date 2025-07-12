# 📞 API Contact Manager - Documentation Professionnelle

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Express.js](https://img.shields.io/badge/Express.js-4.21.2-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8.10.1-green)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![License](https://img.shields.io/badge/License-ISC-blue)
![Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black)

**API REST sécurisée pour la gestion de contacts avec authentification JWT**

[🌐 **API Live**](https://api-contact-manager.vercel.app/) | [📖 **Documentation API**](https://api-contact-manager.vercel.app/api/docs) | [🔍 **Health Check**](https://api-contact-manager.vercel.app/health)

</div>

---

## 📋 Table des Matières

- [🎯 Vue d'ensemble](#-vue-densemble)
- [🏗️ Architecture](#️-architecture)
- [🔐 Système d'Authentification](#-système-dauthentification)
- [🛡️ Middlewares de Sécurité](#️-middlewares-de-sécurité)
- [📊 Base de Données](#-base-de-données)
- [🚀 Endpoints API](#-endpoints-api)
- [🔧 Installation et Configuration](#-installation-et-configuration)
- [💻 Exemples d'Utilisation](#-exemples-dutilisation)
- [🧪 Tests et Validation](#-tests-et-validation)
- [🚀 Déploiement](#-déploiement)

---

## 🎯 Vue d'ensemble

Cette API Contact Manager est une solution complète et sécurisée pour la gestion de contacts personnels. Elle utilise une architecture RESTful avec authentification JWT, validation des données, et protection contre les accès non autorisés.

### ✨ Fonctionnalités Principales

| Fonctionnalité | Description | Status |
|---|---|---|
| 🔐 **Authentification JWT** | Connexion sécurisée avec tokens | ✅ |
| 👥 **Gestion Utilisateurs** | Inscription, connexion, profil | ✅ |
| 📞 **CRUD Contacts** | Créer, lire, modifier, supprimer | ✅ |
| 🛡️ **Sécurité Avancée** | Validation, autorisation, CORS | ✅ |
| 📱 **API RESTful** | Standards REST respectés | ✅ |
| 🌐 **CORS Support** | Accessible depuis n'importe quel domaine | ✅ |
| 📊 **Logging & Monitoring** | Logs détaillés et gestion d'erreurs | ✅ |

---

## 🏗️ Architecture

### 📁 Structure du Projet

```
api-contact-manager/
├── 📁 config/
│   └── dbConnect.js           # Configuration MongoDB
├── 📁 controllers/
│   ├── contactControllers.js  # Logique métier contacts
│   └── userControllers.js     # Logique métier utilisateurs
├── 📁 middleware/
│   ├── errorhandler.js        # Gestion centralisée des erreurs
│   └── validateToken.js       # Validation JWT
├── 📁 models/
│   ├── contactModel.js        # Schéma MongoDB contacts
│   └── userModel.js           # Schéma MongoDB utilisateurs
├── 📁 routes/
│   ├── contactRouters.js      # Routes contacts
│   └── userRouters.js         # Routes utilisateurs
├── app.js                     # Point d'entrée principal
├── constants.js               # Codes d'erreur HTTP
├── package.json               # Dependencies et scripts
└── vercel.json               # Configuration déploiement
```

### 🔄 Flux de Données

```mermaid
graph TD
    A[Client Request] --> B[Express Server]
    B --> C{Route Type}
    C -->|Public| D[User Routes]
    C -->|Protected| E[JWT Middleware]
    E --> F[Contact Routes]
    D --> G[User Controller]
    F --> H[Contact Controller]
    G --> I[User Model]
    H --> J[Contact Model]
    I --> K[MongoDB]
    J --> K
    K --> L[Response]
    L --> A
```

---

## 🔐 Système d'Authentification

### 🎯 Stratégie JWT

Notre API utilise **JSON Web Tokens (JWT)** pour l'authentification stateless et sécurisée.

#### 📋 Processus d'Authentification

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API
    participant DB as Database
    
    Note over C,DB: 1. Inscription
    C->>A: POST /user/register
    A->>A: Hash password (bcrypt)
    A->>DB: Save user
    DB-->>A: User created
    A-->>C: Success response
    
    Note over C,DB: 2. Connexion
    C->>A: POST /user/login
    A->>DB: Find user by email
    DB-->>A: User data
    A->>A: Compare password (bcrypt)
    A->>A: Generate JWT token
    A-->>C: JWT token
    
    Note over C,DB: 3. Accès protégé
    C->>A: Request + JWT token
    A->>A: Validate JWT
    A->>DB: Database operation
    DB-->>A: Data
    A-->>C: Protected data
```

#### 🔧 Configuration JWT

| Paramètre | Valeur | Description |
|---|---|---|
| **Algorithm** | `HS256` | HMAC SHA-256 |
| **Expiration** | `10 minutes` | Durée de vie du token |
| **Secret** | `ACCESS_TOKEN_SECRET` | Clé secrète 256-bit |
| **Payload** | `{username, email, id}` | Données utilisateur |

#### 🛡️ Sécurité JWT

```javascript
// Génération du token
const accessToken = jwt.sign(
  {
    username: user.username,
    email: user.email,
    id: user._id
  },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: '10m' }
);

// Validation du token
const validateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    res.status(401);
    throw new Error('Token requis');
  }
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  req.user = decoded;
  next();
};
```

---

## 🛡️ Middlewares de Sécurité

### 🔒 Validation des Tokens (validateToken.js)

Le middleware `validateToken` sécurise les routes protégées :

```javascript
const validateToken = asyncHandler(async (req, res, next) => {
  // 1. Extraction du token depuis le header Authorization
  const token = req.header('Authorization')?.split(' ')[1];
  
  // 2. Vérification de la présence du token
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
  
  // 3. Validation et décodage du token
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
  // 4. Injection des données utilisateur dans req.user
  req.user = decoded;
  
  // 5. Passage au middleware suivant
  next();
});
```

### 🚨 Gestion d'Erreurs (errorhandler.js)

Middleware centralisé pour une gestion cohérente des erreurs :

```javascript
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode || 500;
  
  // Logging détaillé
  console.error('Error:', {
    statusCode,
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  
  // Réponse structurée selon le type d'erreur
  switch (statusCode) {
    case 400: // Validation Error
    case 401: // Unauthorized
    case 403: // Forbidden
    case 404: // Not Found
    case 500: // Server Error
  }
};
```

### 🌐 CORS Configuration

Protection et ouverture contrôlée de l'API :

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
```

---

## 📊 Base de Données

### 🗃️ Schémas MongoDB

#### 👤 Modèle Utilisateur

```javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email requis'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Mot de passe requis'],
    minlength: 6
  }
}, {
  timestamps: true // Ajoute createdAt et updatedAt
});
```

#### 📞 Modèle Contact

```javascript
const contactSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'  // Relation avec User
  },
  name: {
    type: String,
    required: [true, 'Nom requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email requis'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Téléphone requis'],
    trim: true
  }
}, {
  timestamps: true
});
```

### 🔗 Relations de Données

```mermaid
erDiagram
    USER ||--o{ CONTACT : "has many"
    USER {
        ObjectId _id
        string username
        string email
        string password
        date createdAt
        date updatedAt
    }
    CONTACT {
        ObjectId _id
        ObjectId user_id
        string name
        string email
        string phone
        date createdAt
        date updatedAt
    }
```

### ⚙️ Configuration de Connexion

```javascript
const dbConnect = async () => {
  try {
    const options = {
      maxPoolSize: 10,              // Limite de connexions
      serverSelectionTimeoutMS: 5000, // Timeout serveur
      socketTimeoutMS: 45000,        // Timeout socket
    };
    
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    
    // Gestion des événements
    mongoose.connection.on('error', (err) => {
      console.error('❌ Erreur MongoDB:', err);
    });
    
  } catch (error) {
    console.error(`❌ Erreur de connexion: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      setTimeout(dbConnect, 5000); // Reconnexion auto
    } else {
      process.exit(1);
    }
  }
};
```

---

## 🚀 Endpoints API

### 🔓 Routes Publiques (Authentication)

#### 📝 Inscription

```http
POST /user/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "motdepasse123"
}
```

**Réponse Succès (201):**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "user": {
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### 🔑 Connexion

```http
POST /user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "motdepasse123"
}
```

**Réponse Succès (200):**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 👤 Profil Utilisateur

```http
GET /user/current
Authorization: Bearer {token}
```

### 🔒 Routes Protégées (Contacts)

> **⚠️ Important:** Toutes les routes de contacts requièrent un token JWT valide dans le header `Authorization: Bearer {token}`

#### 📋 Obtenir tous les contacts

```http
GET /contact/all
Authorization: Bearer {token}
```

**Réponse:**
```json
{
  "success": true,
  "message": "get-all-contacts",
  "contacts": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "user_id": "507f1f77bcf86cd799439012",
      "name": "Marie Dupont",
      "email": "marie@example.com",
      "phone": "+33123456789",
      "createdAt": "2025-07-12T10:30:00.000Z",
      "updatedAt": "2025-07-12T10:30:00.000Z"
    }
  ]
}
```

#### 👁️ Obtenir un contact spécifique

```http
GET /contact/get/{id}
Authorization: Bearer {token}
```

#### ➕ Créer un contact

```http
POST /contact/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Marie Dupont",
  "email": "marie@example.com",
  "phone": "+33123456789"
}
```

#### ✏️ Modifier un contact

```http
PUT /contact/update/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Marie Dupont-Martin",
  "email": "marie.martin@example.com",
  "phone": "+33987654321"
}
```

#### 🗑️ Supprimer un contact

```http
DELETE /contact/delete/{id}
Authorization: Bearer {token}
```

### 📊 Routes Utilitaires

#### 🏥 Health Check

```http
GET /health
```

**Réponse:**
```json
{
  "status": "OK",
  "timestamp": "2025-07-12T12:49:08.548Z",
  "uptime": 32.2497822
}
```

#### 📖 Documentation API

```http
GET /api/docs
```

---

## 🔧 Installation et Configuration

### 📋 Prérequis

- **Node.js** >= 18.x
- **MongoDB** (Atlas ou local)
- **Git**

### 🚀 Installation Locale

```bash
# 1. Cloner le repository
git clone https://github.com/NourIslamAoudia/api-contact-manager.git
cd api-contact-manager

# 2. Installer les dépendances
npm install

# 3. Configuration de l'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# 4. Démarrer en mode développement
npm run dev

# 5. Ou en mode production
npm start
```

### ⚙️ Variables d'Environnement

```bash
# Configuration serveur
PORT=3000
NODE_ENV=development

# Base de données MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Sécurité JWT
ACCESS_TOKEN_SECRET=votre_clé_secrète_très_longue_et_sécurisée_256_bits
```

### 🔑 Génération de la Clé JWT

```bash
# Générer une clé sécurisée
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 💻 Exemples d'Utilisation

### 🌐 JavaScript/Fetch API

```javascript
class ContactManagerAPI {
  constructor(baseURL = 'https://api-contact-manager.vercel.app') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('jwt_token');
  }

  // Inscription
  async register(userData) {
    const response = await fetch(`${this.baseURL}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await response.json();
  }

  // Connexion
  async login(credentials) {
    const response = await fetch(`${this.baseURL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    
    if (data.accessToken) {
      this.token = data.accessToken;
      localStorage.setItem('jwt_token', data.accessToken);
    }
    
    return data;
  }

  // Obtenir tous les contacts
  async getContacts() {
    const response = await fetch(`${this.baseURL}/contact/all`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    return await response.json();
  }

  // Créer un contact
  async createContact(contactData) {
    const response = await fetch(`${this.baseURL}/contact/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(contactData)
    });
    return await response.json();
  }

  // Supprimer un contact
  async deleteContact(contactId) {
    const response = await fetch(`${this.baseURL}/contact/delete/${contactId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    return await response.json();
  }
}

// Utilisation
const api = new ContactManagerAPI();

async function example() {
  try {
    // Connexion
    const loginResult = await api.login({
      email: 'john@example.com',
      password: 'motdepasse123'
    });
    
    // Créer un contact
    const newContact = await api.createContact({
      name: 'Alice Martin',
      email: 'alice@example.com',
      phone: '+33123456789'
    });
    
    // Obtenir tous les contacts
    const contacts = await api.getContacts();
    console.log('Mes contacts:', contacts);
    
  } catch (error) {
    console.error('Erreur:', error);
  }
}
```

### 🐍 Python/Requests

```python
import requests
import json

class ContactManagerAPI:
    def __init__(self, base_url="https://api-contact-manager.vercel.app"):
        self.base_url = base_url
        self.token = None
    
    def register(self, username, email, password):
        response = requests.post(f"{self.base_url}/user/register", 
                               json={"username": username, "email": email, "password": password})
        return response.json()
    
    def login(self, email, password):
        response = requests.post(f"{self.base_url}/user/login", 
                               json={"email": email, "password": password})
        data = response.json()
        if 'accessToken' in data:
            self.token = data['accessToken']
        return data
    
    def get_contacts(self):
        headers = {"Authorization": f"Bearer {self.token}"}
        response = requests.get(f"{self.base_url}/contact/all", headers=headers)
        return response.json()
    
    def create_contact(self, name, email, phone):
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        data = {"name": name, "email": email, "phone": phone}
        response = requests.post(f"{self.base_url}/contact/add", 
                               headers=headers, json=data)
        return response.json()

# Utilisation
api = ContactManagerAPI()

# Connexion
login_result = api.login("john@example.com", "motdepasse123")
print("Connexion:", login_result)

# Créer un contact
contact = api.create_contact("Alice Martin", "alice@example.com", "+33123456789")
print("Contact créé:", contact)

# Obtenir tous les contacts
contacts = api.get_contacts()
print("Tous les contacts:", contacts)
```

---

## 🧪 Tests et Validation

### 🔍 Tests manuels avec cURL

```bash
# Variables d'environnement
export API_URL="https://api-contact-manager.vercel.app"
export TOKEN=""

# 1. Test de santé
curl -X GET "$API_URL/health"

# 2. Inscription
curl -X POST "$API_URL/user/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

# 3. Connexion (sauvegarder le token)
export TOKEN=$(curl -s -X POST "$API_URL/user/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | jq -r '.accessToken')

# 4. Profil utilisateur
curl -X GET "$API_URL/user/current" \
  -H "Authorization: Bearer $TOKEN"

# 5. Créer un contact
curl -X POST "$API_URL/contact/add" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Contact",
    "email": "contact@test.com",
    "phone": "+33123456789"
  }'

# 6. Obtenir tous les contacts
curl -X GET "$API_URL/contact/all" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🚀 Déploiement

### 🌐 Déploiement Vercel (Production)

#### 1. Configuration MongoDB Atlas

```bash
# 1. Créer un compte MongoDB Atlas (gratuit)
# 2. Créer un cluster M0 (gratuit)
# 3. Configurer l'accès réseau (0.0.0.0/0 pour Vercel)
# 4. Créer un utilisateur database
# 5. Obtenir la chaîne de connexion
```

#### 2. Variables d'environnement Vercel

```bash
# Dans le dashboard Vercel, ajouter :
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/api
ACCESS_TOKEN_SECRET=your_256_bit_secret_key_here
NODE_ENV=production
```

#### 3. Déploiement automatique

```bash
# 1. Pousser vers GitHub
git add .
git commit -m "Ready for production"
git push origin main

# 2. Importer dans Vercel
# 3. Configurer les variables d'environnement
# 4. Déployer automatiquement !
```

---

## 🤝 Contribution et Support

### 📞 Support

- 📧 **Email** : nourislam.aoudia@example.com
- 🐛 **Issues** : [GitHub Issues](https://github.com/NourIslamAoudia/api-contact-manager/issues)
- 📖 **Documentation** : [API Docs](https://api-contact-manager.vercel.app/api/docs)

### 📋 Roadmap

- [ ] **v1.1** : Pagination des contacts
- [ ] **v1.2** : Upload d'images de profil
- [ ] **v1.3** : API de recherche avancée
- [ ] **v1.4** : Système de notifications
- [ ] **v2.0** : Interface web React

---

## 📄 Licence

Ce projet est sous licence **ISC**. Voir le fichier `LICENSE` pour plus de détails.

---

## 🎯 Conclusion

Cette API Contact Manager offre une solution robuste et sécurisée pour la gestion de contacts. Avec son architecture modulaire, sa sécurité JWT, et sa facilité de déploiement, elle constitue une base solide pour des applications de gestion de contacts.

**🌟 Points forts :**
- ✅ Sécurité JWT robuste
- ✅ Architecture RESTful propre
- ✅ Déploiement simple sur Vercel
- ✅ Documentation complète
- ✅ Gestion d'erreurs centralisée
- ✅ Support CORS pour intégration web

---

<div align="center">

**Développé avec ❤️ par [Nour Islam Aoudia](https://github.com/NourIslamAoudia)**

[🌐 API Live](https://api-contact-manager.vercel.app/) | [📖 Documentation](https://api-contact-manager.vercel.app/api/docs) | [🔍 Health Check](https://api-contact-manager.vercel.app/health)

</div>
