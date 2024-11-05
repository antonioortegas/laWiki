const express = require('express')
//const wikiRoutes = require('../routes/wikiRouter')
const userRoutes = require('../routes/userRouter')

const app = express()
app.use(express.json())

//app.use('/wiki', wikiRoutes)
app.use('/user', userRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = app;