const Entry = require('../models/entryModel');

const getEntries = async (req, res) => {
    try {
        const entries = await Entry.find();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({
            message: "Server error retrieving entries",
            error: err
        });
    }
}

const getEntry = async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);
        if (!entry) {
            return res.status(404).json('Entry not found');
        }
        res.status(200).json(entry);
    } catch (err) {
        res.status(500).json({
            message: "Server error retrieving entry",
            error: err
        });
    }
}

const createEntry = async (req, res) => {
    try {
        const newEntry = new Entry(req.body);
        const savedEntry = await newEntry.save();
        res.status(201).json(savedEntry);
    } catch (err) {
        res.status(500).json({
            message: "Server error creating entry",
            error: err
        });
    }
}

const updateEntry = async (req, res) => {
    try {
        const updatedEntry = await Entry.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true });
        if (!updatedEntry) {
            return res.status(404).json('Entry not found');
        }
        res.status(200).json(updatedEntry);
    }
    catch (err) {
        res.status(500).json({
            message: "Server error updating entry",
            error: err
        });
    }
}

const deleteEntry = async (req, res) => {
    try {
        const deletedEntry = await Entry.findByIdAndDelete(req.params.id);
        if (!deletedEntry) {
            return res.status(404).json('Entry not found');
        }
        res.status(200).json('Entry deleted');
    } catch (err) {
        res.status(500).json({
            message: "Server error deleting entry",
            error: err
        });
    }
}

module.exports = {
    getEntries,
    getEntry,
    createEntry,
    updateEntry,
    deleteEntry,
}