const Wiki = require('../models/wikiModel');

const getWikis = async (req, res) => {
    try {
        // allow filter by tags and title, and sort by title
        const validParams = ['tags', 'title', 'sortBy'];
        Object.keys(req.query).forEach(param => {
            if (!validParams.includes(param)) {
                return res.status(400).json({ error: `Invalid parameter: ${param}, valid parameters are: ${validParams.join(', ')}` });
            }
        });

        const filter ={}
        const sort = {};
        if (req.query.tags) {
            filter.tags = { $in: req.query.tags.split(','), $options: 'i' };
        }
        if (req.query.title) {
            filter.title = { $regex: req.query.title, $options: 'i' };
        }
        if (req.query.sortBy) {
            if (req.query.sortBy === 'title') {
                sort = { title: 1 };
            } else {
                return res.status(400).json({ error: `Invalid sortBy parameter: ${req.query.sortBy}` });
            }
        }

        const wikis = await Wiki.find(filter).sort(sort);
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
        //id is the title of the wiki
        const wiki = await Wiki.find({title:id});
        
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
        const wiki = await Wiki.deleteOne({title:id});
        if (!wiki) {
            return res.status(404).json({ message: 'Wiki no encontrada.' });
        }
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
        const { description, content,language,tags } = req.body;

        const wiki = await Wiki.findOne({title:id});
        if (!wiki) {
            return res.status(404).json({ message: 'Wiki no encontrado.' });
        }

        wiki.description=description;
        wiki.content=content;
        wiki.language=language;
        wiki.tags=tags;

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
