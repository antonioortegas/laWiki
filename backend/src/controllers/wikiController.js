const { create } = require('../models/userModel');
const Wiki = require('../models/wikiModel');
const {get} = require('mongoose');

const getWikis = async (req, res) => {
    try {
        const wikis = await Wiki.find();
        res.status(200).json(wikis);
    }
    catch (error) {
        console.error('Error al obtener las wikis:', error);
        res.status(500).json({ message: 'Error al obtener las wikis.' });
    }
}

const getWikiById = async (req, res) => {
    try {
        const { id } = req.params;
        const wiki = await Wiki.findById(id);
        if (!wiki) {
            return res.status(404).json({ message: 'Wiki no encontrada.' });
        }
        res.status(200).json(wiki);
    }
    catch (error) {
        console.error('Error al obtener la wiki:', error);
        res.status(500).json({ message: 'Error al obtener la wiki.' });
    }
}

const deleteWiki = async (req, res) => {
    try {
        const { id } = req.params;
        const wiki = await Wiki.findById(id);
        if (!wiki) {
            return res.status(404).json({ message: 'Wiki no encontrada.' });
        }
        await wiki.remove();
        res.status(200).json({ message: 'Wiki eliminada.' });
    }
    catch (error) {
        console.error('Error al eliminar la wiki:', error);
        res.status(500).json({ message: 'Error al eliminar la wiki.' });
    }
}
const updateWiki = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, content,language,tags,entries } = req.body;

        const wiki = await Wiki.findById(id);
        if (!wiki) {
            return res.status(404).json({ message: 'Wiki no encontrado.' });
        }

        wiki.title=title;
        wiki.description=description;
        wiki.content=content;
        wiki.language=language;
        wiki.tags=tags;
        wiki.entries=entries;

        const savedWiki = await wiki.save();
        res.status(200).json(savedWiki);
    }
    catch (error) {
        console.error('Error al actualizar la Wiki:', error);
        res.status(500).json({ message: 'Error al actualizar la Wiki.' });
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

module.exports = {
    getWikiById,
    updateWiki,
    deleteWiki,
    getWikis,
    createWiki,
}
//add module exports
/*
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

module.exports = {
    getWikis,
    getWiki,
    createWiki,
    updateWiki,
    deleteWiki,
    getAbout,
}
*/
