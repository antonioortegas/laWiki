const Version = require('../models/versionModel');
const Entry = require('../../../entry-service/src/models/entryModel');
const getVersions = async (req, res) => {
    try {
        filter = {};

        if (req.query.entry) {
            filter.entry = req.query.entry;
        }

        // Date format: YYYY-MM-DDTHH:MM:SSZ
        const startDate = new Date(req.query.from);
        const endDate = new Date(req.query.to);

        if (startDate && endDate) {
            filter.createdAt = { $gte: startDate, $lte: endDate };
        } else if (startDate) {
            filter.createdAt = { $gte: startDate };
        } else if (endDate) {
            filter.createdAt = { $lte: endDate };
        }

        const versions = await Version.find();
        res.status(200).json(versions);
    } catch (err) {
        res.status(500).json({
            message: "Server error retrieving versions",
            error: err
        });
    }
}
const getVersionsByEntry = async (req, res) => {
    try {
        const filter = { entry: req.params.entryId };
        const versions = await Version.find(filter);
        res.status(200).json(versions);
    } catch (err) {
        res.status(500).json({
            message: "Server error retrieving versions by entry",
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

// Create a new version
const createVersion = async (req, res) => {
    try {
        const newVersion = new version(req.body);
        const savedVersion = await newVersion.save();
        res.status(201).json(savedVersion);
    } catch (err) {
        res.status(400).json({ message: 'Error al crear la versión', err});
    }
};

// Get a specific version
const getVersionById = async (req, res) => {
    try {
        const versionFound = await version.findById(req.params.id);
        res.status(200).json(versionFound);
    } catch (err) {
        res.status(500).json({ message: 'No se encontró la versión', err });
    }
};

// Update a specific version
const updateVersion = async (req, res) => {
    try {
        const updatedVersion = await version.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedVersion) {
            return res.status(404).json({ message: 'Versión no encontrada' });
        }
        res.status(200).json(updatedVersion);
    }
    catch (err) {
        res.status(500).json({ message: 'Error al actualizar la versión', err });
    }
};

// Delete a specific version
const deleteVersion = async (req, res) => {
    try {
        const deletedVersion = await version.findByIdAndDelete(req.params.id);
        if (!deletedVersion) {
            return res.status(404).json({ message: 'Versión no encontrada' });
        }
        res.status(200).json({ message: 'Versión eliminada' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar la versión', err });
    }
};

module.exports = {
    createVersion,
    getVersions,
    getVersionById,
    updateVersion,
    deleteVersion,
    getVersionsByEntry,
};
