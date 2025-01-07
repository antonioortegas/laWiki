const express = require('express')
const wikiRoutes = require('../routes/wikiRouter')
const cors = require('cors')

//allow cross-origin requests from any domain
var corsOptions = {
  origin: '*',
}

const app = express()
app.use(express.json())
app.use(cors(corsOptions))

app.use('/wikis', wikiRoutes)

app.get('/', (req, res) => {
  res.status(200).send('Hello World!')
})

module.exports = app;