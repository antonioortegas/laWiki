const express = require('express')
const wikiRoutes = require('../routes/wikiRouter')

const app = express()
app.use(express.json())

app.use('/wikis', wikiRoutes)

app.get('/', (req, res) => {
  res.status(200).send('Hello World!')
})

module.exports = app;