const Wiki = require('../models/wikiModel');

const getWikis = async (req, res) => {
    try {
        const wikis = await Wiki.find();
        res.status(200).json(wikis);
    } catch (err) {
        res.status(500).json({
            message: "Server error retrieving wikis",
            error: err
        });
    }
}

const getWiki = async (req, res) => {
    try {
        const wiki = await Wiki.findById(req.params.id);
        if (!wiki) {
            return res.status(404).json('Wiki not found');
        }
        res.status(200).json(wiki);
    } catch (err) {
        res.status(500).json({
            message: "Server error retrieving wiki",
            error: err
        });
    }
}

const createWiki = async (req, res) => {
    try {
        const { title, createdBy } = req.body;
        if (!title || !createdBy) {
            return res.status(400).json('Title and createdBy are required');
        }

        const newWiki = new Wiki(req.body);
        const savedWiki = await newWiki.save();
        res.status(201).json(savedWiki);
    } catch (err) {
        res.status(500).json({
            message: "Server error creating wiki",
            error: err
        });
    }
}

const updateWiki = async (req, res) => {
    try {
        const updatedWiki = await Wiki.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true });
        if (!updatedWiki) {
            return res.status(404).json('Wiki not found');
        }
        res.status(200).json(updatedWiki);
    }
    catch (err) {
        res.status(500).json({
            message: "Server error updating wiki",
            error: err
        });
    }
}

const deleteWiki = async (req, res) => {
    try {
        const deletedWiki = await Wiki.findByIdAndDelete(req.params.id);
        if (!deletedWiki) {
            return res.status(404).json('Wiki not found');
        }
        res.status(200).json('Wiki deleted');
    } catch (err) {
        res.status(500).json({
            message: "Server error deleting wiki",
            error: err
        });
    }
}


const searchWikiTitle = async (req, res) => {
    try {
        const { title } = req.query;

        // Validación básica
        if (!title) {
            return res.status(400).json({ error: "The parameter 'title' is needed." });
        }

        // Buscar wikis con títulos que contengan el texto ingresado (búsqueda parcial)
        const wikis = await Wiki.find({ title: new RegExp(title, 'i') });

        // Retornar resultados
        res.json(wikis);

    } catch (error) {
        res.status(500).json({ error: "Searching error." });
    }
};

// Endpoint para filtrar por creador y etiquetas
const searchWikiTag = async (req, res) => {
    try {
        const {tags} = req.query;

        // Validación básica
        if (!tags) {
            return res.status(400).json({ error: "at least one parameter 'tags' is needed." });
        }

        // Construir filtro dinámico
        let filter = {};
        if (tags) filter.tags = { $in: tags.split(',') }; // Convierte la lista de etiquetas en un array

        // Buscar en la base de datos
        const wikis = await Wiki.find(filter);

        res.json(wikis);

    } catch (error) {
        res.status(500).json({ error: "Error at Filtering." });
    }
};





module.exports = {
    getWikis,
    getWiki,
    createWiki,
    updateWiki,
    deleteWiki,
    searchWikiTag,
    searchWikiTitle,
}