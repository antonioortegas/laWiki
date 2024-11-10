require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./src/apps/userApp')
const seedingApp = require('./src/apps/seedingApp')

const PORT = process.env.PORT || 3001;
console.log('PORT:', PORT);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin@localhost:27017/laWiki?authSource=admin';
console.log('MONGODB_URI:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log('Server running at http://localhost:' + PORT);
        });
        seedingApp.listen(3000, () => {
            console.log('Seeding server running at http://localhost:' + (3000));
        });
    }).catch((error) => {
        console.log(error);
    });