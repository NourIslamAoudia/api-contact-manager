const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const contactRouter = require('./routes/contactRouters');
const errorHandler = require('./middleware/errorhandler');
const dbConnect = require('./config/dbConnect');


dbConnect();


app.use(express.json());//middleware pour parser le body en json de client
app.use('/contact', contactRouter);
app.use(errorHandler);//middleware pour gérer les erreurs


  
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});