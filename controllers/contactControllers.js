//response requsted data

const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel');
const mongoose = require('mongoose');


//c rigli
const getAllContacts =asyncHandler( async (req, res) => {
    const contacts=await Contact.find();
    res.status(200).json({ message: 'get-all-contacts', contacts });
});


const getContact = asyncHandler(async (req, res, next) => {
    try {

        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        res.status(200).json({ message: "get-contact", contact });

    } catch (error) {
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
        name,
        email,
        phone
    });
    await contact.save();
    res.status(200).json({ message: 'add-contact', name, email, phone });
});



const updateContact =asyncHandler( async (req, res) => {
    res.status(200).json({ message: 'update-contact', id: req.params.id });
});

const deleteContact =asyncHandler( async (req, res) => {
    res.status(200).json({ message: 'delete-contact', id: req.params.id });
});




module.exports = {
    getAllContacts,
    getContact,
    addContact,
    updateContact,
    deleteContact
}