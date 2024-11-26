const express = require('express')

// import json data
const users = require('./seeding/data/users.json')
const wikis = require('./seeding/data/wikis.json')
const entries = require('./seeding/data/entries.json')
const versions = require('./seeding/data/versions.json')

// import models
const User = require('../models/userModel')
const Wiki = require('./seeding/models/wikiModel')
const Entry = require('./seeding/models/entryModel')
const Version = require('./seeding/models/versionModel')

const app = express()
app.use(express.json())

app.get('/seed', (req, res) => {
    seedDB();
    res.status(200).send('Droping all data and seeding again');
})

const seedDB = async () => {
    try{
        // clear all data
        await User.deleteMany({});
        await Wiki.deleteMany({});
        await Entry.deleteMany({});
        await Version.deleteMany({});

        await User.insertMany(users);
        await Wiki.insertMany(wikis);
        await Entry.insertMany(entries);
        await Version.insertMany(versions);
        console.log('Data seeded');
    } catch (error) {
        console.log(error);
    }
}

module.exports = app;