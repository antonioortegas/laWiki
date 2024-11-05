const Wiki = require('../models/wikiModel');
const {get} = require('mongoose');



const getWikiById = async (req, res) => {
    try {
        const { id } = req.params;
        const wiki = await Wiki.findById(id);
        if (!wiki) {
            return res.status(404).json({ message: 'Wiki no encontrada.' });
        }
        res.status(200).json(user);
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
module.exports = {
    getWikiById,
    updateWiki,
    deleteWiki,
}
//add module exports
/*
const getWiki = async (req, res) => {
    res.send('Hello World from the wiki controller!');
}

const createWiki = async (req, res) => {
    const newWiki = new Wiki(req.body);
    try {
        const savedWiki = await newWiki.save();
        res.status(201).json(savedWiki);
    } catch (err) {
        res.status(400).json(err);
    }
}

const getAbout = async (req, res) => {
    res.send('Hello World from the wiki/about controller!');
}

module.exports = {
    getWiki,
    createWiki,
    getAbout,
}
*/
