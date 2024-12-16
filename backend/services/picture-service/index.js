const appCloudinary = require("./src/apps/appCloudinary");

appCloudinary.listen(4000, () => 
    console.log("Cloudinary is running on port 4000")
);