const appTranslation = require("./src/apps/appTranslation");
const PORT = process.env.PORT || 4001;

appTranslation.listen(PORT, () => 
    console.log("The trasnlation microservice is running on port " + PORT)
);