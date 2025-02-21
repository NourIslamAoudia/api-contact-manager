//response requsted data

const asyncHandler = require('express-async-handler');

const getAllContacts =asyncHandler( async (req, res) => {
    res.status(200).json({ message: 'All contacts' });
});

const getContact =asyncHandler( async (req, res) => {
    res.status(200).json({ message: 'get-contact', id: req.params.id });
});

const addContact =asyncHandler( async (req, res) => {
    const { name, email, phone } = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error('All fields are required');
    }
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