const { get } = require('mongoose');
const User = require('../models/userModel');

const createUser = async (req, res) => {
    try {

        const { name, email, role } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }
        

        const user = new User({
            name,
            email,
            role,
            ratings: [],
            notifications: []
        });

        const savedUser = await user.save();

        res.status(201).json(savedUser);
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ message: 'Error al crear el usuario.' });
    }
}

const getUser = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ message: 'Error al obtener los usuarios.' });
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ message: 'Error al obtener el usuario.' });
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        user.name = name;
        user.email = email;
        user.role = role;

        const savedUser = await user.save();
        res.status(200).json(savedUser);
    }
    catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ message: 'Error al actualizar el usuario.' });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        await user.remove();
        res.status(200).json({ message: 'Usuario eliminado.' });
    }
    catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ message: 'Error al eliminar el usuario.' });
    }
}

const getUsersByMinRating = async (req, res) => {
    try {
        const minRating = parseFloat(req.params.minRating);

        if (isNaN(minRating)) {
            return res.status(400).json({ message: 'El parámetro minRating debe ser un número válido.' });
        }

        const users = await User.find({ averageRating: { $gte: minRating } });

        res.status(200).json(users);
    } 
    catch (error) {
        console.error('Error al obtener usuarios con calificación mínima:', error);
        res.status(500).json({ message: 'Error al obtener usuarios con calificación mínima.' });
    }
}

const getUsersByPartialName = async (req, res) => {
    try {
        const { name } = req.params;

        // Options 'i' makes the search case-insensitive 
        const users = await User.find({ name: { $regex: name, $options: 'i' } });

        res.status(200).json(users);
    } 
    catch (error) {
        console.error('Error al buscar usuarios por nombre parcial:', error);
        res.status(500).json({ message: 'Error al buscar usuarios por nombre parcial.' });
    }
};

module.exports = {
    createUser,
    getUser,
    getUserById,
    updateUser,
    deleteUser,
    getUsersByMinRating,
    getUsersByPartialName
};