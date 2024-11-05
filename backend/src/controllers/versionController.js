const Version = require('../models/versionModel');

const getVersions = async (req, res) => {
    try {
        const versions = await Version.find();
        res.status(200).json(versions);
    } catch (err) {
        res.status(500).json({
            message: "Server error retrieving versions",
            error: err
        });
    }
}

const getVersion = async (req, res) => {
    try {
        const version = await Version.findById(req.params.id);
        if (!version) {
            return res.status(404).json('Version not found');
        }
        res.status(200).json(version);
    } catch (err) {
        res.status(500).json({
            message: "Server error retrieving version",
            error: err
        });
    }
}

const createVersion = async (req, res) => {
    try {
        const { entry, content, createdBy } = req.body;
        if (!entry || !content || !createdBy) {
            return res.status(400).json('Entry, content, and createdBy are required');
        }

        const newVersion = new Version(req.body);
        const savedVersion = await newVersion.save();
        res.status(201).json(savedVersion);
    } catch (err) {
        res.status(500).json({
            message: "Server error creating version",
            error: err
        });
    }
}

const updateVersion = async (req, res) => {
    try {
        const updatedVersion = await Version.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true });
        if (!updatedVersion) {
            return res.status(404).json('Version not found');
        }
        res.status(200).json(updatedVersion);
    }
    catch (err) {
        res.status(500).json({
            message: "Server error updating version",
            error: err
        });
    }
}

const deleteVersion = async (req, res) => {
    try {
        const deletedVersion = await Version.findByIdAndDelete(req.params.id);
        if (!deletedVersion) {
            return res.status(404).json('Version not found');
        }
        res.status(200).json('Version deleted');
    } catch (err) {
        res.status(500).json({
            message: "Server error deleting version",
            error: err
        });
    }
}

module.exports = {
    getVersions,
    getVersion,
    createVersion,
    updateVersion,
    deleteVersion,
}