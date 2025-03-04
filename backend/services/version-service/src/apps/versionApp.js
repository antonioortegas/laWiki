const express = require('express')
const versionRoutes = require('../routes/versionRouter')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

app.use('/versions', versionRoutes)

app.get('/', (req, res) => {
  res.status(200).send('Hello World!')
})

module.exports = app;