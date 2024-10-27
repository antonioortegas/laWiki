const Wiki = require('../models/wikiModel');
// Create the collection in the database if it doesn't exist

/*
The controller is responsible for handling the incoming requests
each function here is associated with a route, so for example
getWiki will be called when the user accesses the /wiki path
*/

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