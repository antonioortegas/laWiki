import express from 'express'
import morgan from 'morgan' 
import routerCloudinary from '../routes/routesCloudinary.js'

const app = express()

app.use(morgan('dev2'))
app.use(express.json()) 

app.use('/cloudinary', routerCloudinary)

export default app;