const User = require('../models/userModel');

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
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

const getUsersByMinRating = async (req, res) => {
    try {
        const minRating = parseFloat(req.params.minRating);

        if (isNaN(minRating)) {
            return res.status(400).json({ message: 'Parameter must be a valid number' });
        }

        const users = await User.find({ averageRating: { $gte: minRating } });

        res.status(200).json(users);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obtaining users by minimum rating.' });
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
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUsersByMinRating,
    getUsersByPartialName,
}