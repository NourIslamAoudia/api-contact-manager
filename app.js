const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const contactRouter = require('./routes/contactRouters');


app.use('/contacts', contactRouter);


app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});