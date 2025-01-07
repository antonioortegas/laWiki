const appTranslation = require("./src/apps/appTranslation");

appTranslation.listen(4001, () => 
    console.log("The trasnlation microservice is running on port 4001")
);