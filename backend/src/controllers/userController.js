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

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
}