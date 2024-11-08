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
        const { wiki, title, createdBy } = req.body;
        if (!wiki || !title || !createdBy) {
            return res.status(400).json('Wiki, title, and createdBy are required');
        }

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

const filterByEditor = async (req, res) => {
    try {
        
        const {id} = req.params;
        const entries = await Entry.find({ editors: id });
        res.status(200).json(entries);

    } catch (error) {
        console.log('Error when filtering entries: ', error)
        res.status(500).json({ message: 'Error when filtering entries by editor' })
    }
}

const filterByAscDate = async (req, res) => {
    try {
        const entries = await Entry.find();

        const sortedAsc = entries.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        res.status(200).json(sortedAsc);

    } catch (error) {
        console.log('Error when filtering entries: ', error)
        res.status(500).json({ message: 'Error when filtering entries by ascending creation date' })
    }
}

const filterByDescDate = async (req, res) => {
    try {
        const entries = await Entry.find();

        const sortedDesc = entries.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json(sortedDesc);

    } catch (error) {
        console.log('Error when filtering entries: ', error)
        res.status(500).json({ message: 'Error when filtering entries by descending creation date' })
    }
}

const filterByTitleOrContent = async (req, res) => {
    try {
        const {text}  = req.body;

        console.log(text)

        const entries = await Entry.find();

        const entryList = entries.filter(item => {
            return item.title.includes(text) || item.content.includes(text);
        });

        res.status(200).json(entryList);

    } catch (error) {
        console.log('Error when filtering entries: ', error)
        res.status(500).json({ message: 'Error when filtering entries by title or content' })
    }
}

const filterByTags = async (req, res) => {
    try {
        const {tags} = req.body;

        if (!Array.isArray(tags) || tags.length === 0) {
            return res.status(400).json({ error: "At least one parameter 'tags' is needed." });
        }

        const filter = { tags: { $in: tags } }; 

        const entries = await Entry.find(filter);

        res.status(200).json(entries);

    } catch (error) {
        res.status(500).json({ error: "Error at filtering by tags." });
    }
};



module.exports = {
    getEntries,
    getEntry,
    createEntry,
    updateEntry,
    deleteEntry,
    filterByEditor,
    filterByAscDate,
    filterByDescDate,
    filterByTitleOrContent,
    filterByTags,
}