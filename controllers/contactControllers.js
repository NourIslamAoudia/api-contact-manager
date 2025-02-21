//response requsted data

const getAllContacts = async (req, res) => {
    res.status(200).json({ message: 'All contacts' });
}

const getContact = async (req, res) => {
    res.status(200).json({ message: 'get-contact', id: req.params.id });
}

const addContact = (req, res) => {
    const { name, email, phone } = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error('All fields are required');
    }
    res.status(200).json({ message: 'add-contact', name, email, phone });
}

const updateContact = async (req, res) => {
    res.status(200).json({ message: 'update-contact', id: req.params.id });
}

const deleteContact = async (req, res) => {
    res.status(200).json({ message: 'delete-contact', id: req.params.id });
}




module.exports = {
    getAllContacts,
    getContact,
    addContact,
    updateContact,
    deleteContact
}