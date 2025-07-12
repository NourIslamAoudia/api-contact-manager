const express = require('express');
const dotenv = require('dotenv');
const contactRouter = require('./routes/contactRouters');
const errorHandler = require('./middleware/errorhandler');
const dbConnect = require('./config/dbConnect');
const userRouter = require('./routes/userRouters');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to the database
dbConnect();

// CORS middleware pour permettre l'accès depuis n'importe quel domaine
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

// Middleware to parse the body as JSON
app.use(express.json());

// Route de santé pour vérifier que l'API fonctionne
app.get('/', (req, res) => {
  res.json({
    message: 'API Contact Manager - Fonctionnelle ✅',
    version: '1.0.0',
    endpoints: {
      contacts: '/contact',
      users: '/user'
    },
    documentation: 'Voir README.md pour plus de détails'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Documentation API
app.get('/api/docs', (req, res) => {
  res.json({
    name: 'API Contact Manager',
    version: '1.0.0',
    description: 'API REST pour la gestion de contacts avec authentification JWT',
    baseUrl: req.protocol + '://' + req.get('host'),
    endpoints: {
      authentication: {
        register: {
          method: 'POST',
          path: '/user/register',
          description: 'Inscription d\'un nouvel utilisateur',
          body: {
            username: 'string (requis)',
            email: 'string (requis)',
            password: 'string (requis)'
          }
        },
        login: {
          method: 'POST',
          path: '/user/login',
          description: 'Connexion utilisateur',
          body: {
            email: 'string (requis)',
            password: 'string (requis)'
          }
        },
        profile: {
          method: 'GET',
          path: '/user/current',
          description: 'Obtenir le profil utilisateur actuel',
          headers: {
            Authorization: 'Bearer <token>'
          }
        }
      },
      contacts: {
        getAll: {
          method: 'GET',
          path: '/contact/all',
          description: 'Obtenir tous les contacts de l\'utilisateur',
          headers: {
            Authorization: 'Bearer <token>'
          }
        },
        getOne: {
          method: 'GET',
          path: '/contact/get/:id',
          description: 'Obtenir un contact spécifique',
          headers: {
            Authorization: 'Bearer <token>'
          }
        },
        create: {
          method: 'POST',
          path: '/contact/add',
          description: 'Créer un nouveau contact',
          headers: {
            Authorization: 'Bearer <token>'
          },
          body: {
            name: 'string (requis)',
            email: 'string (requis)',
            phone: 'string (requis)'
          }
        },
        update: {
          method: 'PUT',
          path: '/contact/update/:id',
          description: 'Mettre à jour un contact',
          headers: {
            Authorization: 'Bearer <token>'
          },
          body: {
            name: 'string (optionnel)',
            email: 'string (optionnel)',
            phone: 'string (optionnel)'
          }
        },
        delete: {
          method: 'DELETE',
          path: '/contact/delete/:id',
          description: 'Supprimer un contact',
          headers: {
            Authorization: 'Bearer <token>'
          }
        }
      }
    },
    examples: {
      curl_register: `curl -X POST ${req.protocol}://${req.get('host')}/user/register -H "Content-Type: application/json" -d '{"username":"john","email":"john@example.com","password":"123456"}'`,
      curl_login: `curl -X POST ${req.protocol}://${req.get('host')}/user/login -H "Content-Type: application/json" -d '{"email":"john@example.com","password":"123456"}'`,
      curl_contacts: `curl -X GET ${req.protocol}://${req.get('host')}/contact/all -H "Authorization: Bearer YOUR_TOKEN"`
    }
  });
});

// Routes
app.use('/contact', contactRouter);
app.use('/user', userRouter);

// Error handling middleware
app.use(errorHandler);

// Export pour Vercel
module.exports = app;

// Start the server seulement si ce n'est pas Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
  });
}