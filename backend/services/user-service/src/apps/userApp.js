const express = require('express')
const userRoutes = require('../routes/userRouter')
const cors = require('cors');


const app = express()
app.use(express.json())

app.use(cors());

app.use('/users', userRoutes)

app.get('/', (req, res) => {
  res.status(200).send('Hello World!')
})

module.exports = app;