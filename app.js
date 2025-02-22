const express = require('express');
const dotenv = require('dotenv');
const contactRouter = require('./routes/contactRouters');
const errorHandler = require('./middleware/errorhandler');
const dbConnect = require('./config/dbConnect');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to the database
dbConnect();

// Middleware to parse the body as JSON
app.use(express.json());

// Routes
app.use('/contact', contactRouter);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});