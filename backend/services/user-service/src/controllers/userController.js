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
    } catch (err) {
        res.status(500).json({
            message: "Server error retrieving users",
            error: err
        });
    }
}

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json('User not found');
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({
            message: "Server error retrieving user",
            error: err
        });
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
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true });
        if (!updatedUser) {
            return res.status(404).json('User not found');
        }
        res.status(200).json(updatedUser);
    }
    catch (err) {
        res.status(500).json({
            message: "Server error updating user",
            error: err
        });
    }
}

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json('User not found');
        }
        res.status(200).json('User deleted');
    } catch (err) {
        res.status(500).json({
            message: "Server error deleting user",
            error: err
        });
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
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUserEntries,
}