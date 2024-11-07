const express = require('express')
const entryRoutes = require('../routes/entryRouter')

const app = express()
app.use(express.json())

app.use('/entries', entryRoutes)

app.get('/', (req, res) => {
  res.status(200).send('Hello World!')
})

module.exports = app;