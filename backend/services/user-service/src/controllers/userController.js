const axios = require('axios');
const User = require('../models/userModel');
const { get } = require('mongoose');

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

const getAverageRating = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const ratings = user.ratings; 
        const average = calcAverageRating(ratings);
        
        res.status(200).json({average});
    } catch (error) {
        console.error('Error when retrieving average rating for user:', error.message);
        res.status(500).json({ message: 'Error when retrieving average rating for user:', error: error.message });
    }
};

const calcAverageRating = (ratings) => {
    if (ratings.length === 0) {
        return 0;
    }

    const sum = ratings.reduce((acc, rating) => acc + rating.score, 0);
    return sum / ratings.length;
};

// Add a new notification for user by id
const addNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.notifications.push({ message });
        await user.save();
        if(user.getNotificationsByEmail)
            sendEmail(user.email, message);

        res.status(201).json({ message: 'Notification sent successfully' });
    } catch (error) {
        console.error('Error when adding notification for user:', error.message);
        res.status(500).json({ message: 'Error when adding notification for user:', error: error.message });
    }
};

// TODO: Implement email sending
const sendEmail = async (email, message) => {
    // Send email
};

// Mark a notification as read. Send notification id in request body as idNotification
const markasRead = async (req, res) => {
    try {
        const { idUser } = req.params;
        const { idNotification } = req.body;

        const user = await User.findById(idUser);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const notification = user.notifications.id(idNotification);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found', idNotification });
        }

        notification.read = true;
        await user.save();

        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error when marking notification as read:', error.message);
        res.status(500).json({ message: 'Error when marking notification as read:', error: error.message });
    }
};

const addRating = async (req, res) => {
    try {
        const { idUser } = req.params;
        const { ratedBy, score } = req.body;

        const user = await User.findById(idUser);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingRating = user.ratings.find(rating => rating.ratedBy === ratedBy);
        if (existingRating) {
            return res.status(400).json({ message: 'Already rated by this user' });
        }

        user.ratings.push({ ratedBy, score });
        user.averageRating = calcAverageRating(user.ratings);
        await user.save();

        res.status(201).json({ message: 'Rating added successfully' });
    }
    catch (error) {
        console.error('Error when adding rating for user:', error.message);
        res.status(500).json({ message: 'Error when adding rating for user:', error: error.message });
    }
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUserEntries,
    getAverageRating,
    addNotification,
    markasRead,
    addRating
}