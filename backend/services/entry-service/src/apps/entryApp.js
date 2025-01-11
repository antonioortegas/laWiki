const express = require('express')
const entryRoutes = require('../routes/entryRouter')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

app.use('/entries', entryRoutes)

app.get('/', (req, res) => {
  res.status(200).send('Hello World!')
})

module.exports = app;