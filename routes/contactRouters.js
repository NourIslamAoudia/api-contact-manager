const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactControllers');

router.get('/all', contactController.getAllContacts);

router.get('/get/:id', contactController.getContact);

router.post('/add', contactController.addContact);

router.put('/update/:id', contactController.updateContact);

router.delete('/delete/:id', contactController.deleteContact);

module.exports = router;