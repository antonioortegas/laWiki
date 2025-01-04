const axios = require('axios');
const User = require('../models/userModel');
const { get } = require('mongoose');
require('dotenv').config();
const { Resend } = require('resend')
const resend = new Resend(process.env.RESEND_API_KEY);
const { OAuth2Client } = require('google-auth-library');
//const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require("jsonwebtoken");
const { addComment } = require('../../../entry-service/src/controllers/entryController');

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
    const emailMessage = await formatEmailMessage(message);
    const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'New notification on La Wiki',
        html: emailMessage
    });
    if (error) {
        console.error('Error sending email:', error);
    } else {
        console.log('Email sent:', data);
    }
};

// Format email message with entry title and clickable link
const formatEmailMessage = async (message) => {
    const regexComment = /You received a (reply|comment) on (http?:\/\/[^\s]+)\/entries\/([a-zA-Z0-9]+): (.+)/;
    const regexEdit = /Your entry ([a-zA-Z0-9]{24}) has been (deleted|updated)/;
    
    const match = message.match(regexComment);
    const match2 = message.match(regexEdit);

    console.log('Mensaje de notificación:', message);
    if (match) {
      const type = match[1]; // Reply or comment
      const entryId = match[3]; // Entry ID
      const content = match[4];
      const entryUrl = `${entriesAPI}/${entryId}`;

      if(entryId){
        try {
          console.log('Obteniendo el nombre de la entrada con ID:', entryId);
          const entryResponse = await axios.get(`${entriesAPI}/${entryId}`);
          var entryTitle = entryResponse.data[0].title;
          console.log('Título de la entrada:', entryTitle);
        } catch (error) {
          console.error("Error al obtener el nombre de la entrada:", error);
        }
      }

      // Create the formatted message with a clickable link
      return `You received a ${type} on <a href="${entryUrl}" target="_blank">${entryTitle}</a>: ${content}`;
    } else if (match2) {
      const entryId = match2[1]; // Entry ID
      const action = match2[2]; // Deleted or updated
      const entryUrl = `${entriesAPI}/${entryId}`;

      if(entryId){
        try {
          console.log('Obteniendo el nombre de la entrada con ID:', entryId);
          const entryResponse = await axios.get(`${entriesAPI}/${entryId}`);
          var entryTitle = entryResponse.data[0].title;
          console.log('Título de la entrada:', entryTitle);
        } catch (error) {
          console.error("Error al obtener el nombre de la entrada:", error);
        }
      }

      // Create the formatted message with a clickable link
      return `Your entry <a href="${entryUrl}" target="_blank">${entryTitle}</a> has been ${action}`;
    }

    // If message does not match any pattern, return the original message
    return message;
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

// Login a user with oAuthId
const login = async (req, res) => {
    try {
        const { token } = req.body;
        const decodedToken = jwt.decode(token);

        let user = await User.findOne({ oauthId: decodedToken.sub });
        if (!user) {
            console.log("User not found with oauthId: " + decodedToken.sub);

            // Crear un nuevo usuario
            user = new User({
                oauthId: decodedToken.sub,
                name: decodedToken.name,
                email: decodedToken.email,
                profilePicture: decodedToken.picture,
                notifications: [{ message: "Welcome to La Wiki!" }]
            });

            // Guardar el nuevo usuario en la base de datos
            await user.save();
            console.log("Created user: ", user);
        }

        // Crear el payload para el token JWT
        const payload = {
            id: user._id,
            email: user.email,
            name: user.name,
            profilePicture: user.profilePicture
        };

        // Generar el token JWT con caducidad de 7 dias
        const tokenJwt = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Enviar el usuario y el token como respuesta
        res.status(200).json({ user, customToken: tokenJwt });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Validate a token
const validateToken = async (req, res) => {
    const { token } = req.body;

    try {
        // Decodificar y verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verifica si el usuario existe en la base de datos
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ valid: false, message: "Usuario no encontrado." });
        }

        // Token válido, devuelve datos del usuario
        res.status(200).json({ valid: true, user });

    } catch (err) {
        // Token inválido o expirado
        console.log("Token inválido o caducado: " + err);
        res.status(401).json({ valid: false, message: "Token inválido o caducado." });
    }
};

// Renew a token
const renewToken = async (req, res) => {
    const { token } = req.body;

    try {
        // Verificar y decodificar el token original
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Crear un nuevo token con los mismos datos pero con nueva expiración
        const payload = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture,
        };

        // Generar un nuevo token con caducidad de 7 días
        const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Enviar el nuevo token al cliente
        res.status(200).json({ newToken });
    } catch (error) {
        console.error("Error al renovar el token:", error);
        res.status(401).json({ message: "Token inválido o caducado." });
    }
};

// Add a comment to the list of comments of a user
const addUserComment = async (req, res) => {
    try {
        const { idUser } = req.params;
        const { entryId, commentId, content, responseTo } = req.body;

        const user = await User.findById(idUser);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        newComment = { entryId, commentId, content, responseTo };
        user.comments.push(newComment);
        await user.save();

        res.status(201).json({ message: 'Comment added to user' });
    }
    catch (error) {
        console.error('Error when adding comment to user:', error.message);
        res.status(500).json({ message: 'Error when adding comment to user:', error: error.message });
    }
};

// Delete a comment from the list of comments of a user
const deleteUserComment = async (req, res) => {
    try {
        const { idUser } = req.params;
        const { entryId, commentId } = req.body;

        const user = await User.findById(idUser);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const comment = user.comments.find(c => c.entryId == entryId && c.commentId == commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        user.comments.pull(comment);
        await user.save();

        res.status(200).json({ message: 'Comment deleted from user' });
    }
    catch (error) {
        console.error('Error when deleting comment from user:', error.message);
        res.status(500).json({ message: 'Error when deleting comment from user:', error: error.message });
    }
};

// Get count of comments for a user
const countUserComments = async (req, res) => {
    try {
        const { idUser } = req.params;

        const user = await User.findById(idUser);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const count = user.comments.length;
        res.status(200).json({ count });
    }
    catch (error) {
        console.error('Error when getting comments for user:', error.message);
        res.status(500).json({ message: 'Error when getting comments for user:', error: error.message });
    }
};

// Add an entry to the list of entries of a user
const addUserEntry = async (req, res) => {
    try {
        const { idUser } = req.params;
        const { entryId, title } = req.body;

        const user = await User.findById(idUser);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user.entries.push({
            entryId: entryId,
            title: title
        });
        await user.save();

        res.status(201).json({ message: 'Entry added to user' });
    }
    catch (error) {
        console.error('Error when adding entry to user:', error.message);
        res.status(500).json({ message: 'Error when adding entry to user:', error: error.message });
    }
};

// Delete an entry from the list of entries of a user
const deleteUserEntry = async (req, res) => {
    try {
        const { idUser } = req.params;
        const { entryId } = req.body;

        const user = await User.findById(idUser);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.entries.pull({ entryId: entryId });
        await user.save();

        res.status(200).json({ message: 'Entry deleted from user' });
    }
    catch (error) {
        console.error('Error when deleting entry from user:', error.message);
        res.status(500).json({ message: 'Error when deleting entry from user:', error: error.message });
    }
};

// Get count of entries for a user
const countUserEntries = async (req, res) => {
    try {
        const { idUser } = req.params;

        const user = await User.findById(idUser);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const count = user.entries.length;
        res.status(200).json({ count });
    }
    catch (error) {
        console.error('Error when getting entries for user:', error.message);
        res.status(500).json({ message: 'Error when getting entries for user:', error: error.message });
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
    addUserComment,
    deleteUserComment,
    countUserComments,
    addUserEntry,
    deleteUserEntry,
    countUserEntries,
    addRating,
    login,
    validateToken,
    renewToken,
};

