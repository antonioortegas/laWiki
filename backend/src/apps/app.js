require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const app = express()
app.use(express.json())

// import the necessary routes
const wikiRoutes = require('../routes/wikiRouter')

// respond with "hello world" when a GET request is made to the homepage "/"
app.get('/', (req, res) => {
  res.send('Hello World!')
})

/*
this tells the app to use the routes defined in the router.js file
since the routes are defined in the /wiki path, all the routes will be prefixed with /wiki
This means that in the router, defining a "/" route will actually be a "/wiki/" route
*/
app.use('/wiki', wikiRoutes)

mongoose.connect(process.env.MONGO_URI || 'mongodb://admin:admin@localhost:27017/laWiki?authSource=admin')
//TODO: separate the routes for different resources into different files

module.exports = app;