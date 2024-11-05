const express = require('express')
const userRoutes = require('../routes/userRouter')
const wikiRoutes = require('../routes/wikiRouter')
const entryRoutes = require('../routes/entryRouter')
const versionRoutes = require('../routes/versionRouter')

const app = express()
app.use(express.json())

app.use('/users', userRoutes)
app.use('/wikis', wikiRoutes)
app.use('/entries', entryRoutes)
app.use('/versions', versionRoutes)

app.get('/', (req, res) => {
  res.status(200).send('Hello World!')
})

module.exports = app;