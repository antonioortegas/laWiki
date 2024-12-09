const axios = require('axios');
const Entry = require('../models/entryModel');

const usersAPI = process.env.USERS_API_HOST || 'http://localhost:3001/users';
const entryAPI = process.env.ENTRY_API_HOST || 'http://localhost:3003/entries';
const wikisAPI = process.env.WIKIS_API_HOST || 'http://localhost:3002/wikis';

const getEntries = async (req, res) => {
    try {
        filter = {};
        sort = {};
        if (req.query.editor) {
            filter.editors = req.query.editor;
        }
        if (req.query.order === 'asc') {
            sort = { createdAt: 1 };
        }
        if (req.query.order === 'desc') {
            sort = { createdAt: -1 };
        }
        if (req.query.title) {
            filter.title = { $regex: req.query.title, $options: 'i' };
        }
        if (req.query.content) {
            filter.content = { $regex: req.query.content, $options: 'i' };
        }
        if (req.query.tags) {
            filter.tags = { $in: req.query.tags.split(','), $options: 'i' };
        }

        const entries = await Entry.find(filter).sort(sort);
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
        const entry = await Entry.find({entryId: req.params.id});
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
        const { wiki, title, createdBy, entryId } = req.body;
        if (!wiki || !title || !createdBy || !entryId) {
            return res.status(400).json('UUID, wiki, title, and createdBy are required');
        }
        // add the entry to the wiki entryUUIDs array
        // get the wiki from the wiki field in the entry
        const response = await axios.get(`${wikisAPI}/${wiki}`);
        // add the entry to the entryUUIDs array
        const wikiToUpdate = response.data[0];
        wikiToUpdate.entryUUIDs = wikiToUpdate.entryUUIDs.concat(entryId);
        wikiToUpdate.numberOfEntries = wikiToUpdate.entryUUIDs.length;
        
        // save the wiki
        await axios.put(`${wikisAPI}/${wiki}`, wikiToUpdate);

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
        const updatedEntry = await Entry.updateOne({entryId: req.params.id}, req.body);
        if (!updatedEntry) {
            return res.status(404).json('Entry not found');
        }
        // update the entry with the body of the request
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
        console.log(req.params.id);
        const deletedEntry = await Entry.findOneAndDelete({entryId: req.params.id});
        if (!deletedEntry) {
            return res.status(404).json('Entry not found');
        }
        // delete the entry from the wiki entryUUIDs array
        // get the wiki from the wiki field in the entry
        const response = await axios.get(`${wikisAPI}/${deletedEntry.wiki}`);
        // remove the entry from the entryUUIDs array
        const wiki = response.data[0];
        wiki.entryUUIDs = wiki.entryUUIDs.filter(uuid => uuid !== deletedEntry.entryId);
        wiki.numberOfEntries = wiki.entryUUIDs.length;
        
        // save the wiki
        await axios.put(`${wikisAPI}/${deletedEntry.wiki}`, wiki);
        
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

// get all comments from a specific user
const getComments = async (req, res) => {
    try {
        const { user } = req.query;
        if(!user) {
            return res.status(400).json({ message: 'User is required' });
        }
        // user is a partial match by name, query the user service to get the user id
        const users = await axios.get(`${usersAPI}?name=${user}`);
        const userIds = users.data.map(user => user._id);
        console.log('userIds: ', userIds);
        //user id in the comments array, as author
        const filter = { 'comments.author': { $in: userIds } };
        const entries = await Entry.find(filter);
        // get only the comments, if any
        const comments = entries.map(entry => entry.comments).flat();
        res.status(200).json(comments);
    } catch (error) {
        console.log('Error when filtering entries: ', error)
        res.status(500).json({ message: 'Error when filtering entries' })
    }
}
const restoreEntry = async (req, res) => {
    try {
        const entry = await Entry.findOneAndUpdate({ entryId: req.params.id }, req.body);
        if (!entry) {
            return res.status(404).json('Entry not found');
        }
        res.status(200).json(entry);
    }catch(error){
        console.log('Error when filtering entries: ', error)
        res.status(500).json({ message: 'Error when filtering entries' })
    }
};

const getEntryComments = async (req, res) => {
    try {
        const entry = await Entry.findOne({entryId: req.params.id});
        if (!entry) {
            return res.status(404).json('Entry not found');
        }
        res.status(200).json(entry.comments);
    } catch (err) {
        res.status(500).json({
            message: "Server error retrieving entry comments",
            error: err
        });
    }
}

const addComment = async (req, res) => {
    try {
        const { author, content, responseTo } = req.body;
        if (!author || !content) {
            return res.status(400).json('Author and content are required');
        }

        const newComment = {
            content: req.body.content,
            author: req.body.author,
            responseTo,
            createdAt: new Date()
        };
        
        const entry = await Entry.findOne({entryId: req.params.id});
        if (!entry) {
            return res.status(404).json('Entry not found');
        }
       
        entry.comments.push(newComment);
        await entry.save();
        
        const savedComment = entry.comments[entry.comments.length - 1];

        let notificationMessage;
        let userIdToNotify;

        if (responseTo) {
            // If the comment is a response to another comment, notify the author of the parent comment
            const parentComment = entry.comments.find(comment => comment._id.toString() === responseTo);
            if (!parentComment) {
                return res.status(404).json('Parent comment not found');
            }
            userIdToNotify = parentComment.author;
            notificationMessage = `You received a reply on ${entryAPI}/${entry.entryId}: ${content}`;
        } else {
            // If the comment is a response to an entry, notify the author of the entry
            userIdToNotify = entry.createdBy; // El autor de la entrada
            notificationMessage = `You received a comment on ${entryAPI}/(${entry.entryId}: ${content}`;
        }

        // Send a notification to the user
        try {
            await axios.post(`${usersAPI}/${userIdToNotify}/newNotification`, {
                message: notificationMessage
            });
        } catch (err) {
            console.log('Error sending notification to user', err);
        }

        res.status(200).json(savedComment);
    }
    catch (err) {
        res.status(500).json({
            message: "Server error adding comment",
            error: err
        });
    }
}

const deleteComment = async (req, res) => {
    try {
        const entry = await Entry.findOne({ entryId: req.params.id });
        if (!entry) {
            return res.status(404).json('Entry not found');
        }

        const commentId = req.params.idComment;

        // IDs of the child comments to delete related to the parent
        const idsToDelete = getCommentIdsToDelete(entry.comments, commentId);

        entry.comments = entry.comments.filter(comment => !idsToDelete.includes(comment._id.toString()));

        await entry.save();

        res.status(200).json('Comment and its replies deleted');
    } catch (err) {
        res.status(500).json({
            message: "Server error deleting comment",
            error: err
        });
    }
}

// Aux method to delete responses to a comment
const getCommentIdsToDelete = (comments, parentId) => {
    let idsToDelete = [parentId];
    comments.forEach(comment => {
        if (comment.responseTo && comment.responseTo.toString() === parentId) {
            idsToDelete = idsToDelete.concat(getCommentIdsToDelete(comments, comment._id.toString()));
        }
    });
    return idsToDelete;
};

module.exports = {
    getEntries,
    getEntry,
    createEntry,
    updateEntry,
    deleteEntry,
    fuzzyFindByText,
    getComments,
    restoreEntry,
    getEntryComments,
    addComment,
    deleteComment,
}