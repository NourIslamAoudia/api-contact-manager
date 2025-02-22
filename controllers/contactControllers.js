//response requsted data

const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel');


//all private routes
//middleware to protect routes

//c rigli
const getAllContacts =asyncHandler( async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json({ message: 'get-all-contacts', contacts });
});

// c rigli
const getContact = asyncHandler(async (req, res, next) => {
    try {

        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            res.status(404);
            throw new Error('Contact not found');
        }

        if(req.user.id !== contact.user_id.toString()){
            res.status(401);
            throw new Error('Not authorized');
        }
        res.status(200).json({ message: "get-contact", contact });

    } catch (error) {// cas exepctionelle de fonction de mongoose
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        next(error); // Laisse l'error handler gérer d'autres erreurs
    }
});


//c rigli
const addContact =asyncHandler( async (req, res) => {
    const { name, email, phone } = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error('All fields are required');
    }
    const contact = new Contact({
        user_id: req.user.id,
        name,
        email,
        phone
    });
    await contact.save();
    res.status(200).json({ message: 'add-contact', name, email, phone });
});


//c riglii
const updateContact = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    //verifier d'abord les champs
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error('All fields are required');
    }
    
    try {
        const contact = await Contact.findByIdAndUpdate(
            id,
            { name, email, phone },
            { new: true, runValidators: true }// pour retourner le nouveau contact
        );

        if (!contact) {
            res.status(404);
            throw new Error('Contact not found');
        }

        if(req.user.id !== contact.user_id.toString()){
            res.status(401);
            throw new Error('Not authorized');
        }

        res.status(200).json({ message: 'update-contact', contact });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        throw error;
    }
});

// c rigli
const deleteContact = asyncHandler(async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            res.status(404);
            throw new Error('Contact not found');
        }

        if(req.user.id !== contact.user_id.toString()){
            res.status(401);
            throw new Error('Not authorized');
        }
        
        res.status(200).json({ message: 'delete-contact', contact });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        throw error;
    }
});


module.exports = {
    getAllContacts,
    getContact,
    addContact,
    updateContact,
    deleteContact
}