const appCloudinary = require("./src/apps/appCloudinary");
const PORT = process.env.PORT || 3003;

appCloudinary.listen(PORT, () => 
    console.log("Cloudinary is running on port " + PORT)
);