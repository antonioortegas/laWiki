const express = require('express')
//const wikiRoutes = require('../routes/wikiRouter')

const app = express()
app.use(express.json())

//app.use('/wiki', wikiRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = app;