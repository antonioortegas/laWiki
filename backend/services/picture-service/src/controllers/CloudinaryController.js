import cloudinary from 'cloudinary'
import streamifier from 'streamifier'

import dotenv from 'dotenv'
dotenv.config();

let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            (result, error) => {
            if (result) {
                resolve(result);
            } else {
                reject(error);
            }
            }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
};
  
export const upload = async (req, res) => {
    try {
        
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });


        let result = await streamUpload(req);
        res.status(200).json({ message: 'Imagen subida correctamente', imageUrl: result.url});
       
    } catch (error) {
        console.log('Error al subir la imagen: ', error)
        res.status(500).json({ message: 'Error al subir la imagen:', error});
    }
};
