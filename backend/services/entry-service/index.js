require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./src/apps/entryApp')
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:5173', // Reemplázalo por el origen de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
  };
  
  app.use(cors(corsOptions)); // Aplicar configuración de CORS

const PORT = process.env.PORT || 3003;
console.log('PORT:', PORT);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin@localhost:27017/laWiki?authSource=admin';
console.log('MONGODB_URI:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log('Server running at http://localhost:' + PORT);
        });
    }).catch((error) => {
        console.log(error);
    });