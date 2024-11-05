const express = require('express')
//const wikiRoutes = require('../routes/wikiRouter')
const versionRoutes = require('../routes/versionRouter')

const app = express()
app.use(express.json())

//app.use('/wiki', wikiRoutes)
app.use('/version', versionRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = app;