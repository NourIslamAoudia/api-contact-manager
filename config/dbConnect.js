const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        // Configuration pour la production
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // Limite de connexions simultanées
            serverSelectionTimeoutMS: 5000, // Timeout pour la sélection du serveur
            socketTimeoutMS: 45000, // Timeout pour les opérations
            bufferMaxEntries: 0, // Disable mongoose buffering
            bufferCommands: false, // Disable mongoose buffering
        };

        const conn = await mongoose.connect(process.env.MONGO_URI, options);
        
        console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
        console.log(`📂 Base de données: ${conn.connection.name}`);
        
        // Gestion des événements de connexion
        mongoose.connection.on('error', (err) => {
            console.error('❌ Erreur MongoDB:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB déconnecté');
        });
        
        // Fermeture propre en cas d'arrêt de l'application
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('🔌 Connexion MongoDB fermée');
            process.exit(0);
        });
        
    } catch (error) {
        console.error(`❌ Erreur de connexion MongoDB: ${error.message}`);
        
        // En production, on ne veut pas planter l'application immédiatement
        if (process.env.NODE_ENV === 'production') {
            console.error('🔄 Tentative de reconnexion dans 5 secondes...');
            setTimeout(dbConnect, 5000);
        } else {
            process.exit(1);
        }
    }
};

module.exports = dbConnect;