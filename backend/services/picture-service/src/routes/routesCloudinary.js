const express = require('express')
const multer = require('multer')
const cloudinaryController = require('../controllers/CloudinaryController')

const routerCloudinary = express.Router()
const fileUpload = multer();

routerCloudinary.post('/subirFoto', fileUpload.single('foto'), cloudinaryController.upload)

module.exports = routerCloudinary;