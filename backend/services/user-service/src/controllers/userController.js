const axios = require('axios');
const User = require('../models/userModel');

const entriesAPI = process.env.ENTRIES_API_HOST || 'http://localhost:3003/entries';

const getUsers = async (req, res) => {
    try {
        const filter = {};
        if (req.query.name) {
            filter.name = { $regex: req.query.name, $options: 'i' };
        }
        if (req.query.minRating) {
            if (isNaN(parseFloat(req.query.minRating))) {
                return res.status(400).json({ message: 'Parameter must be a valid number' });
            }
            filter.averageRating = { $gte: parseFloat(req.query.minRating) };
        }

        const users = await User.find(filter);
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

const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json('Name and email are required');
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({
            message: "Server error creating user",
            error: err
        });
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
}

// Get all entries created or edited by a user, optionally filtered by text
const getUserEntries = async (req, res) => {
    try {
        const { userId } = req.params;
        const { text } = req.query;

        if (text) {
            const fuzzyResponse = await axios.get(`${entriesAPI}/search`, {
                params: { text }
            });

            const userEntries = fuzzyResponse.data.filter(entry =>
                entry.createdBy === userId || entry.editors.includes(userId)
            );

            return res.status(200).json(userEntries);
        }

        const response = await axios.get(`${entriesAPI}`, {
            params: { editor: userId }
        });

        res.status(200).json(response.data);

    } catch (error) {
        console.error('Error when retrieving entries for user:', error.message);
        res.status(500).json({ message: 'Error retrieving entries for user', error: error.message });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUsersByMinRating,
    getUsersByPartialName,
    getUserEntries
};

