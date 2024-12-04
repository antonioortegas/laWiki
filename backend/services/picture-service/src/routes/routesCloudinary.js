import express from 'express'
import multer from 'multer'
import { upload } from '../controllers/CloudinaryController.js'

const routerCloudinary = express.Router()
const fileUpload = multer();

routerCloudinary.post('/subirFoto', fileUpload.single('foto'), upload);


export default routerCloudinary