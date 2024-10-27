require('dotenv').config()
const express = require('express')
const app = express()
// use the port from the environment variable, if available
const PORT = process.env.PORT || 3000 

// import the necessary routes
const wikiRoutes = require('./src/routes/wikiRouter')

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

//TODO: separate the routes for different resources into different files
app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${PORT}/`)
})
