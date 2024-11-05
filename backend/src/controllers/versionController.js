const version = require('../models/versionModel');

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

// Get all versions
const getVersions = async (req, res) => {
    try {
        const versions = await version.find();
        res.status(200).json(versions);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las versiones', err});
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
    deleteVersion
};
