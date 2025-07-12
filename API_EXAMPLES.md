# 📖 Exemples d'utilisation de l'API

## Base URL
```
Production: https://votre-api.vercel.app
Local: http://localhost:3000
```

## 🔐 Authentification

### 1. Inscription d'un utilisateur
```bash
curl -X POST https://votre-api.vercel.app/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "monMotDePasse123"
  }'
```

**Réponse :**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### 2. Connexion
```bash
curl -X POST https://votre-api.vercel.app/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "monMotDePasse123"
  }'
```

**Réponse :**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Obtenir le profil utilisateur
```bash
curl -X GET https://votre-api.vercel.app/user/current \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 📞 Gestion des contacts

### 1. Créer un contact
```bash
curl -X POST https://votre-api.vercel.app/contact/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -d '{
    "name": "Marie Dupont",
    "email": "marie.dupont@example.com",
    "phone": "+33123456789"
  }'
```

### 2. Obtenir tous les contacts
```bash
curl -X GET https://votre-api.vercel.app/contact/all \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

### 3. Obtenir un contact spécifique
```bash
curl -X GET https://votre-api.vercel.app/contact/get/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

### 4. Mettre à jour un contact
```bash
curl -X PUT https://votre-api.vercel.app/contact/update/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -d '{
    "name": "Marie Dupont-Martin",
    "phone": "+33987654321"
  }'
```

### 5. Supprimer un contact
```bash
curl -X DELETE https://votre-api.vercel.app/contact/delete/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

## 🌐 Utilisation avec JavaScript (Fetch API)

### Inscription et connexion
```javascript
// Inscription
const registerUser = async () => {
  const response = await fetch('https://votre-api.vercel.app/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'johndoe',
      email: 'john@example.com',
      password: 'monMotDePasse123'
    })
  });
  
  const data = await response.json();
  console.log(data);
};

// Connexion
const loginUser = async () => {
  const response = await fetch('https://votre-api.vercel.app/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'john@example.com',
      password: 'monMotDePasse123'
    })
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.accessToken);
  return data.accessToken;
};
```

### Gestion des contacts
```javascript
// Obtenir le token stocké
const getToken = () => localStorage.getItem('token');

// Créer un contact
const createContact = async (contactData) => {
  const response = await fetch('https://votre-api.vercel.app/contact/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(contactData)
  });
  
  return await response.json();
};

// Obtenir tous les contacts
const getAllContacts = async () => {
  const response = await fetch('https://votre-api.vercel.app/contact/all', {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  return await response.json();
};

// Exemple d'utilisation
const main = async () => {
  try {
    // Se connecter
    const token = await loginUser();
    
    // Créer un contact
    const newContact = await createContact({
      name: 'Alice Martin',
      email: 'alice@example.com',
      phone: '+33123456789'
    });
    
    // Obtenir tous les contacts
    const contacts = await getAllContacts();
    console.log('Tous les contacts:', contacts);
    
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

## ⚡ Codes de statut HTTP

| Code | Signification |
|------|---------------|
| 200  | Succès |
| 201  | Créé avec succès |
| 400  | Erreur de validation |
| 401  | Non autorisé (token manquant/invalide) |
| 403  | Accès interdit |
| 404  | Ressource non trouvée |
| 500  | Erreur serveur |

## 🔗 Liens utiles

- **Documentation API** : https://votre-api.vercel.app/api/docs
- **Santé de l'API** : https://votre-api.vercel.app/health
- **Repository GitHub** : https://github.com/votre-username/api-contact-manager
