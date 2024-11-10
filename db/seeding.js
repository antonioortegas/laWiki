// populateDatabase.js

const { MongoClient } = require('mongodb');

// Replace with your MongoDB URI
const uri = "mongodb://admin:admin@localhost:27017/laWiki?authSource=admin"; // or your MongoDB Atlas connection string

// Define the database and collection names
const dbName = "laWiki";
const collectionName1 = "entries";
const collectionName2 = "users";
const collectionName3 = "wikis";
// Sample data to insert

const dummyEntries = [
    {
        wiki: '672ff23347c527e0c5efce0e', // Example ObjectId
        title: 'Godzilla',
        content: 'Godzilla is a giant monster originating from a series of Japanese films.',
        createdBy: '672fedd5bb2f6f3e5e692492', // Example ObjectId
        language: 'es',
        editors: ['672fedd5bb2f6f3e5e692492'],
        attachments: [],
        version: [],
        comments: [],
        tags: ['monster', 'kaiju', 'japan'],
    },
    {
        wiki: '672ff23347c527e0c5efce0e', // Example ObjectId
        title: 'King Ghidorah',
        content: 'King Ghidorah is a fictional monster appearing in the Godzilla series.',
        createdBy: '672fedd5bb2f6f3e5e692492', // Example ObjectId
        language: 'es',
        editors: [],
        attachments: [],
        version: [],
        comments: [],
        tags: ['monster', 'kaiju', 'godzilla'],
    },
    {
        wiki: '672ff23347c527e0c5efce10', // Example ObjectId
        title: 'Goku',
        content: 'Goku is the main protagonist of the Dragon Ball series.',
        createdBy: '672fedd5bb2f6f3e5e692492', // Example ObjectId
        language: 'es',
        editors: [],
        attachments: [],
        version: [],
        comments: [{author:'672fedd5bb2f6f3e5e692496',content:'Me encanta este personaje!'}],
        tags: ['saiyan', 'hero', 'dragon ball'],
    },
    {
        wiki: '672ff23347c527e0c5efce10', // Example ObjectId
        title: 'Vegeta',
        content: 'Vegeta is the prince of the fallen Saiyan race and a main character in the Dragon Ball series.',
        createdBy: '672fedd5bb2f6f3e5e692495', // Example ObjectId
        language: 'es',
        editors: ['672fedd5bb2f6f3e5e692495'],
        attachments: [],
        version: [],
        comments: [{author:'672fedd5bb2f6f3e5e692496',content:'Ojalá le dieran más protagonismo en la serie.',_id: "672ffc32e9dea3e4db0413e9"},
        {author:'672fedd5bb2f6f3e5e692495',content:'Pues sí la verdad!',responseTo:"672ffc32e9dea3e4db0413e9"}],
        tags: ['saiyan', 'prince', 'dragon ball'],
    },
    {
        wiki: '672ff23347c527e0c5efce10', // Example ObjectId
        title: 'Frieza',
        content: 'Frieza is one of the main antagonists in the Dragon Ball series.',
        createdBy: '672fedd5bb2f6f3e5e692492', // Example ObjectId
        language: 'es',
        editors: [],
        attachments: [],
        version: [],
        comments: [{author:'672fedd5bb2f6f3e5e692495',content:'Freezer es mi personaje favorito, la muerte de Krilin fue épica!'}],
        tags: ['villain', 'alien', 'dragon ball'],
    }
    ,
    {
        wiki: '672ff23347c527e0c5efce12', // Example ObjectId
        title: 'Pikachu',
        content: 'Pikachu is an Electric-type Pokémon and the mascot of the Pokémon franchise.',
        createdBy: '672fedd5bb2f6f3e5e692493', // Example ObjectId
        language: 'es',
        editors: [],
        attachments: [],
        version: [],
        comments: [{author:'672fedd5bb2f6f3e5e692493',content:'Espero que pronto nos den un pikachu de evento...'}],
        tags: ['electric', 'pokemon', 'mascot'],
    },
    {
        wiki:'672ff23347c527e0c5efce12', // Example ObjectId
        title: 'Charizard',
        content: 'Charizard is a Fire/Flying-type Pokémon and one of the most popular Pokémon in the franchise.',
        createdBy: '672fedd5bb2f6f3e5e692493', // Example ObjectId
        language: 'es',
        editors: ['672fedd5bb2f6f3e5e692492'],
        attachments: [],
        version: [],
        comments: [],
        tags: ['fire', 'flying', 'pokemon'],
    }
    ,
    {
        wiki: '672ff23347c527e0c5efce11', // Example ObjectId
        title: 'Berserk',
        content: 'Berserk is a dark fantasy manga series written and illustrated by Kentaro Miura.',
        createdBy: '672fedd5bb2f6f3e5e692496', // Example ObjectId
        language: 'es',
        editors: [],
        attachments: [],
        version: [],
        comments: [{author:'672fedd5bb2f6f3e5e692493',content:'Espero que pronto se retome la serie...'}],
        tags: ['dark fantasy', 'manga', 'kentaro miura'],
    }
];

const sampleUsers = [
    { name: 'John Doe', email: 'john57@gmail.com',role: 'admin' },
    { name: 'Jane Smith', email: 'jane83@gmail.com',role: 'writer' },
    { name: 'Alice Johnson', email: 'alice43@gmail.com',role: 'writer'},
    { name: 'Bob Brown', email: 'bob765@gmail.com' ,role: 'writer' },
    { name: 'Charlie Davis', email: 'charlie74@gmail.com',role:'reader' }
];

const sampleWikis = [
    { title: "Godzilla", createdBy: '672fedd5bb2f6f3e5e692492', description: "A wiki made by and for the fans of this great franchise...",
        content:"The first Godzilla movie was released...",tags:["movies","kaiju","japan"],entries:['672ffcf7a0f9e53195e5656e','672ffcf7a0f9e53195e5656f']},
    { title: "League of Legends", createdBy: '672fedd5bb2f6f3e5e692492', description: "Comprehensive guide to League..." ,
        content:"This is a stub, you can help by contributing..."},
    { title: "Dragon Ball", createdBy: '672fedd5bb2f6f3e5e692495', description: "All info from everything related to dragon ball, from games to anime...",content:"We are deeply saddened by the lost of Akira sensei..." ,
        tags:["anime","manga","japan"],entries:['672ffcf7a0f9e53195e56570','672ffcf7a0f9e53195e56572','672ffcf7a0f9e53195e56575']
    },
    { title: "Berserk", createdBy: '672fedd5bb2f6f3e5e692494', description: "¡READ BERSERK!" ,content:"Read berserk",tags:["manga","gore","japan"],
    entries:['672ffcf7a0f9e53195e5657a']},
    { title: "Pokemon", createdBy: '672fedd5bb2f6f3e5e692494', description: "Dedicated to all things pokemon",
        content:"Watch the world championship here...",tags:["games","anime","japan"] ,entries:['672ffcf7a0f9e53195e56577','672ffcf7a0f9e53195e56579']},
   
];
async function populateDatabase() {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        // Access the database and collections
        const db = client.db(dbName);
        const entriesCollection = db.collection(collectionName1);
        const usersCollection = db.collection(collectionName2);
        const wikisCollection = db.collection(collectionName3);

        // Insert sample data
        const entriesResult = await entriesCollection.insertMany(dummyEntries);
        console.log(`${entriesResult.insertedCount} entries inserted`);
        const usersResult = await usersCollection.insertMany(sampleUsers);
        console.log(`${usersResult.insertedCount} users inserted`);
        const wikisResult = await wikisCollection.insertMany(sampleWikis);
        console.log(`${wikisResult.insertedCount} wikis inserted`);
    } finally {
        // Close the connection
        await client.close();
    }
}

populateDatabase();