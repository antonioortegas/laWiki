const express = require('express')
const morgan = require('morgan')
const routerTranslation = require('../routes/routesTranslation')
const cors = require('cors')

const app = express()

app.use(morgan('dev2'))
app.use(express.json()) 
app.use(cors())

app.use('/translation', routerTranslation)

module.exports = app;