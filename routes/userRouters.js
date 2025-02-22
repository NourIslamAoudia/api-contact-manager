const express = require('express');
const router = express.Router();

const userController = require('../controllers/userControllers');


router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/current', userController.currentUser);

module.exports = router;