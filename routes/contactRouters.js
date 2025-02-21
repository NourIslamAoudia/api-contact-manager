const express = require('express');
const router = express.Router();

router.get('/allContacts', (req, res) => {
    res.send('All-contacts');
});

router.post('/addContact', (req, res) => {
    res.send('add-contact');
});

router.put('/updateContact/:id', (req, res) => {
    res.send('Update-contact');
});

router.delete('/deleteContact/:id', (req, res) => {
    res.send('delete-contact');
});

module.exports = router;