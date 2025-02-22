const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');

// Register a new user
const registerUser =asyncHandler( async (req, res, next) => {
    const {username, email, password} = req.body;
    if(!username || !email || !password) {
        res.status(400);
        throw new Error('Please fill in all fields');
    }
    const userAvailable = await User.findOne({ email });
    if(userAvailable) {
        res.status(400);
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword:",hashedPassword);

    const user= await User.create({ username, email, password: hashedPassword });
    if(!user) {
        res.status(500);
        throw new Error('User not created');
    }
    res.status(201).json({email: user.email, username: user.username});
});

// Login an existing user
const loginUser = async (req, res, next) => {
    res.status(200).json({ message: 'Login' });
}

// current user
const currentUser = async (req, res, next) => {
    res.status(200).json({ message: 'Current' });
}

module.exports = {
    registerUser,
    loginUser,
    currentUser
};