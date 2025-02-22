const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
        trim: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;