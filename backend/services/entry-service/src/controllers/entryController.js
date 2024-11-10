const Entry = require('../models/entryModel');

const getEntries = async (req, res) => {
    try {
        /*
        router.get('/editor/:id', entryController.filterByEditor);
        router.get('/sorted/asc', entryController.filterByAscDate);
        router.get('/sorted/desc', entryController.filterByDescDate);
        router.get('/search/titleOrDescription', entryController.filterByTitleOrContent)
        router.get('/search/tags', entryController.filterByTags)
        */
        filter = {};
        if (req.query.editor) {
            filter.editors = req.query.editor;
        }
        if (req.query.order === 'asc') {
            filter.sort = { createdAt: 1 };
        }
        if (req.query.order === 'desc') {
            filter.sort = { createdAt: -1 };
        }
        if (req.query.title) {
            filter.title = { $regex: req.query.title, $options: 'i' };
        }
        if (req.query.content) {
            filter.content = { $regex: req.query.content, $options: 'i' };
        }
        if (req.query.tags) {
            filter.tags = { $in: req.query.tags.split(',') };
        }

        const entries = await Entry.find(filter);
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

const fuzzyFindByText = async (req, res) => {
    try {
        // search for a specific text in the title, content, or tags
        const { text } = req.query;
        if (!text) {
            return res.status(400).json({ message: 'Text is required' });
        }
        const entries = await Entry.find({
            $or: [
                { title: { $regex: text, $options: 'i' } },
                { content: { $regex: text, $options: 'i' } },
                { tags: { $regex: text, $options: 'i' } },
            ]
        });
        res.status(200).json(entries);
    } catch (error) {
        console.log('Error when filtering entries: ', error)
        res.status(500).json({ message: 'Error when filtering entries' })
    }
}

module.exports = {
    getEntries,
    getEntry,
    createEntry,
    updateEntry,
    deleteEntry,
    fuzzyFindByText,
}