import appCloudinary from './src/apps/appCloudinary.js'

appCloudinary.listen(4000, () => 
    console.log("Cloudinary is running on port 4000")
);