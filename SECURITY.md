# 🔐 Guide de Sécurité - API Contact Manager

## 🛡️ Mesures de Sécurité Implémentées

### 1. 🔑 Authentification JWT

#### Configuration sécurisée
```javascript
// Génération de token avec expiration courte
const accessToken = jwt.sign(
  payload,
  process.env.ACCESS_TOKEN_SECRET, // Clé 256-bit
  { 
    expiresIn: '10m',  // Expiration courte pour sécurité
    algorithm: 'HS256' // Algorithme sécurisé
  }
);
```

#### Validation stricte
```javascript
const validateToken = (req, res, next) => {
  // 1. Extraction sécurisée du token
  const authHeader = req.header('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? 
    authHeader.split(' ')[1] : null;
  
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }
  
  try {
    // 2. Vérification et décodage
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};
```

### 2. 🔒 Hachage des Mots de Passe

#### Utilisation de bcrypt avec salt rounds élevés
```javascript
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12; // Sécurité élevée

// Hachage lors de l'inscription
const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

// Vérification lors de la connexion
const isValid = await bcrypt.compare(password, user.hashedPassword);
```

### 3. 🚪 Autorisation au Niveau des Ressources

#### Vérification de propriété
```javascript
// Chaque utilisateur ne peut accéder qu'à ses propres contacts
const contact = await Contact.findById(contactId);

if (contact.user_id.toString() !== req.user.id) {
  return res.status(403).json({ 
    error: 'Accès interdit - Ce contact ne vous appartient pas' 
  });
}
```

### 4. 🌐 Configuration CORS Sécurisée

```javascript
// CORS configuré pour production
app.use((req, res, next) => {
  const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? ['https://monapp.com', 'https://www.monapp.com']
    : ['http://localhost:3000', 'http://localhost:3001'];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
```

### 5. 🛠️ Validation des Données

#### Validation stricte des entrées
```javascript
const validateContactData = (req, res, next) => {
  const { name, email, phone } = req.body;
  
  // Validation des champs requis
  if (!name?.trim() || !email?.trim() || !phone?.trim()) {
    return res.status(400).json({ 
      error: 'Tous les champs sont requis' 
    });
  }
  
  // Validation format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Format email invalide' 
    });
  }
  
  // Validation format téléphone
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ 
      error: 'Format téléphone invalide' 
    });
  }
  
  // Sanitisation
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.phone = phone.trim();
  
  next();
};
```

### 6. 🔍 Logging de Sécurité

```javascript
const securityLogger = (req, res, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    method: req.method,
    url: req.url,
    userId: req.user?.id || 'anonymous'
  };
  
  // Log des tentatives d'accès
  console.log('Security Log:', JSON.stringify(logData));
  
  // Alerte sur les actions sensibles
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    console.warn('Sensitive Action:', logData);
  }
  
  next();
};
```

---

## 🚨 Détection et Prévention des Attaques

### 1. Protection contre l'Injection NoSQL

```javascript
// Mongoose protège automatiquement contre l'injection
// Mais ajoutons une validation supplémentaire
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Supprimer les opérateurs MongoDB dangereux
        if (key.startsWith('$')) {
          delete obj[key];
        } else {
          sanitize(obj[key]);
        }
      }
    }
  };
  
  sanitize(req.body);
  sanitize(req.query);
  next();
};
```

### 2. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max
  message: {
    error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes max
  message: {
    error: 'Limite de requêtes atteinte. Réessayez dans 15 minutes.'
  }
});

// Application des limiteurs
app.use('/user/login', authLimiter);
app.use('/user/register', authLimiter);
app.use('/contact', apiLimiter);
```

### 3. Protection contre les Attaques de Timing

```javascript
const crypto = require('crypto');

const constantTimeEquals = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
};

// Utilisation pour comparer les tokens
const isValidToken = constantTimeEquals(providedToken, expectedToken);
```

---

## 🔧 Variables d'Environnement Sécurisées

### Configuration recommandée

```bash
# .env.production
# Base de données - Utilisateur avec permissions limitées
MONGO_URI=mongodb+srv://api_user:strong_password@cluster.mongodb.net/production_db

# JWT - Clé générée aléatoirement 256-bit minimum
ACCESS_TOKEN_SECRET=3fb4c8e9d2a7b5f8e1c6d9a2b7e5f3c8d9a7b2e5f8c1d6a9b3e7f5c2d8a4b6e9f1c3d7a5b8e2f4c6d9a1b3e5f7c8d2a4b6e8f1c5d7a9b2e4f6c8d1a3e5f7c9d2a4b6e8f0c5d7a9b1e3f5c7d8a2b4e6f9c1d3a5e7f8c2d4a6e9f1c3d5a7e8f2c4d6a9e1f3c5d7a8e2f4c6d9a1e3f5c7d8a2e4f6c9d1a3e5f7c8d2a4e6f9c1d3a5e7f8c2d4a6

# Environnement
NODE_ENV=production
PORT=3000

# Logs et monitoring
LOG_LEVEL=warn
ENABLE_SECURITY_LOGS=true

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Session et cookies (si utilisés)
SESSION_SECRET=another_very_long_random_string_for_sessions
COOKIE_SECURE=true
COOKIE_HTTP_ONLY=true
COOKIE_SAME_SITE=strict
```

### Génération sécurisée des secrets

```bash
# Générer une clé JWT de 256 bits
node -e "console.log('ACCESS_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"

# Générer un secret de session
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# Générer un salt unique pour bcrypt
node -e "console.log('BCRYPT_SALT_ROUNDS=' + Math.floor(Math.random() * 5) + 10)"
```

---

## 🛡️ Recommandations de Sécurité Avancées

### 1. Audit de Sécurité Régulier

```bash
# Audit des dépendances
npm audit

# Fix automatique des vulnérabilités
npm audit fix

# Rapport détaillé
npm audit --audit-level moderate
```

### 2. Headers de Sécurité

```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### 3. Monitoring et Alertes

```javascript
const alerting = {
  suspiciousActivity: (req, alert) => {
    console.error('🚨 ALERTE SÉCURITÉ:', {
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      alert: alert,
      url: req.url,
      method: req.method
    });
    
    // Envoyer alerte par email/Slack si nécessaire
    // sendAlert(alert, req);
  },
  
  rateLimitExceeded: (req) => {
    console.warn('⚠️ Rate limit dépassé:', {
      ip: req.ip,
      timestamp: new Date().toISOString()
    });
  },
  
  unauthorizedAccess: (req) => {
    console.error('🚫 Accès non autorisé:', {
      ip: req.ip,
      token: req.header('Authorization')?.substring(0, 20) + '...',
      timestamp: new Date().toISOString()
    });
  }
};
```

### 4. Sauvegarde et Récupération

```javascript
// Script de sauvegarde automatique
const backupDatabase = async () => {
  try {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const backupName = `backup-${timestamp}`;
    
    // Utiliser mongodump pour créer une sauvegarde
    const command = `mongodump --uri="${process.env.MONGO_URI}" --out=./backups/${backupName}`;
    
    console.log('🗄️ Création de la sauvegarde:', backupName);
    // exec(command);
    
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error);
  }
};

// Exécuter la sauvegarde quotidiennement
if (process.env.NODE_ENV === 'production') {
  setInterval(backupDatabase, 24 * 60 * 60 * 1000); // 24h
}
```

---

## 🔍 Checklist de Sécurité

### ✅ Avant le Déploiement

- [ ] **Secrets sécurisés** : Clés JWT > 256 bits
- [ ] **Variables d'environnement** : Aucun secret dans le code
- [ ] **Hachage des mots de passe** : bcrypt avec salt rounds ≥ 10
- [ ] **Validation des entrées** : Tous les inputs validés et sanitisés
- [ ] **Headers de sécurité** : Helmet.js configuré
- [ ] **Rate limiting** : Limites configurées sur auth et API
- [ ] **Logs de sécurité** : Monitoring des actions sensibles
- [ ] **Audit des dépendances** : `npm audit` passé
- [ ] **Tests de sécurité** : Tests d'intrusion basiques effectués

### ✅ En Production

- [ ] **HTTPS obligatoire** : Tous les échanges chiffrés
- [ ] **Base de données sécurisée** : Accès restreint et chiffré
- [ ] **Monitoring actif** : Surveillance des logs d'erreur
- [ ] **Sauvegardes automatiques** : Backup quotidien de la DB
- [ ] **Mise à jour régulière** : Dépendances à jour
- [ ] **Rotation des secrets** : Clés changées périodiquement
- [ ] **Tests de pénétration** : Tests sécurité réguliers

---

## 🚨 Que Faire en Cas d'Incident

### 1. Détection d'Intrusion
```bash
# Immédiatement
1. Changer toutes les clés JWT
2. Révoquer tous les tokens actifs
3. Analyser les logs d'accès
4. Identifier l'origine de l'attaque
5. Corriger la faille exploitée

# Investigation
6. Vérifier l'intégrité des données
7. Notifier les utilisateurs si nécessaire
8. Documenter l'incident
9. Améliorer les mesures de sécurité
```

### 2. Fuite de Données
```bash
# Actions immédiates
1. Isoler le système compromis
2. Évaluer l'étendue de la fuite
3. Notifier les autorités compétentes
4. Informer les utilisateurs affectés
5. Renforcer la sécurité

# Récupération
6. Restaurer depuis une sauvegarde propre
7. Changer tous les secrets et mots de passe
8. Auditer complètement le système
9. Mettre en place des mesures préventives
```

---

**🔐 La sécurité est un processus continu, pas une destination !**

Révisez régulièrement ces mesures et restez informé des dernières menaces et bonnes pratiques de sécurité.
