const express = require('express')
const morgan = require('morgan')
const routerCloudinary = require('../routes/routesCloudinary')
const cors = require('cors')

const app = express()

app.use(morgan('dev2'))
app.use(express.json()) 
app.use(cors())

app.use('/cloudinary', routerCloudinary)

module.exports = app;