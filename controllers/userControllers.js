const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');



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
const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error('Please fill in all fields');
    }
    const existUser = await User.findOne({ email });
    if (!existUser) {
        res.status(400);
        throw new Error('User not found');
    }
    const passwordMatch = await bcrypt.compare(password, existUser.password);
    if (!passwordMatch) {
        res.status(401);
        throw new Error('Inccorect Passowrd');
    }
    const accessToken = jwt.sign({username:existUser.username, email: existUser.email, id: existUser._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
    res.status(200).json({ id: existUser._id, email:existUser.email, username: existUser.username, accessToken });
});




//@ access private
//@desc get current user
const currentUser = async (req, res, next) => {
    res.status(200).json({ user: req.user });
}

module.exports = {
    registerUser,
    loginUser,
    currentUser
};