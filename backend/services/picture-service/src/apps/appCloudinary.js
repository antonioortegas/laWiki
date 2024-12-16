const express = require('express')
const morgan = require('morgan')
const routerCloudinary = require('../routes/routesCloudinary')

const app = express()

app.use(morgan('dev2'))
app.use(express.json()) 

app.use('/cloudinary', routerCloudinary)

module.exports = app;