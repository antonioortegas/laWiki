const axios = require('axios');
const User = require('../models/userModel');
const { get } = require('mongoose');
require('dotenv').config();
const { Resend } = require('resend')
const resend = new Resend(process.env.RESEND_API_KEY);

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

// Revisar si ratings funciona correctamente
const createUser = async (req, res) => {
    try {
        const { name, email, ratings } = req.body;
        if (!name || !email) {
            return res.status(400).json('Name and email are required');
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        const newUser = new User(req.body);

        if(!ratings || ratings.length === 0) {
            newUser.averageRating = 0;
        } else {
            newUser.averageRating = calcAverageRating(ratings);
        }

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
        const { name, email, role, getNotificationsByEmail } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        if(name)
            user.name = name;
        if(email)
            user.email = email;
        if(role)
            user.role = role;
        if(getNotificationsByEmail != undefined)
            user.getNotificationsByEmail = getNotificationsByEmail;

        console.log(user);
        const savedUser = await user.save();
        res.status(200).json(savedUser);
    }
    catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ message: 'Error al actualizar el usuario.', error: error });
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

const getAverageRating = async (req, res) => {
    try {
        const user = await User.findById(req.params.idUser);
        console.log(req.params.idUser);

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

// Get all notifications for user by id
const getNotifications = async (req, res) => {
    try {
        const { idUser } = req.params;

        const user = await User.findById(idUser);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.notifications);
    } catch (error) {
        console.error('Error when retrieving notifications for user:', error.message);
        res.status(500).json({ message: 'Error when retrieving notifications for user:', error: error.message });
    }
};

// Add a new notification for user by id
const addNotification = async (req, res) => {
    try {
        const { idUser } = req.params;
        const { message } = req.body;

        const user = await User.findById(idUser);
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

const sendEmail = async (email, message) => {
    // Send email
    console.log('Sending email to:', email);
    const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Notificación: Entrada modificada',
        html: message
    });
    if (error) {
        console.error('Error sending email:', error);
    } else {
        console.log('Email sent:', data);
    }
};

// Delete a notification for user by id
const deleteNotification = async (req, res) => {
    try {
        const { idUser, idNotification } = req.params;

        const user = await User.findById(idUser);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const notification = user.notifications.id(idNotification);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found', idNotification });
        }

        user.notifications.pull(idNotification);
        await user.save();

        res.status(200).json({ message: 'Notification deleted' });
    } catch (error) {
        console.error('Error when deleting notification for user:', error.message);
        res.status(500).json({ message: 'Error when deleting notification for user:', error: error.message });
    }
};

// Mark a notification as read. Send notification id in request body as idNotification
const markAsRead = async (req, res) => {
    try {
        const { idUser } = req.params;
        const { idNotification } = req.body;

        console.log("idNotification received: ",idNotification);
        console.log("for idUser: ",idUser);
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

// Adds a rating and updates the average rating of the user
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
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUsersByMinRating,
    getUsersByPartialName,
    getUserEntries,
    getAverageRating,
    getNotifications,
    addNotification,
    deleteNotification,
    markAsRead,
    addRating,
};

