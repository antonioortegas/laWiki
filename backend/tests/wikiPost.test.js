const request = require('supertest');
const app = require('../src/apps/app');
const mongoose = require('mongoose');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin@localhost:27017/laWiki?authSource=admin';

describe('Basic Tests', () => {
  let server;

  beforeAll(() => {
    mongoose.connect(MONGODB_URI)
      .then(() => {
        server = app.listen(PORT);
      }
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
  });

  it('should return Hello World!', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
  });

  it('should create a new wiki entry', async () => {
    const newWiki = {
      name: "Programming Wiki",
      description: "A wiki about programming languages.",
      createdBy: "60d21b4667d0d8992e610c85",  // Replace with a valid ObjectId
      categories: ["Tech", "Programming"],
      language: "en"
    };

    const response = await request(app)
      .post('/wiki')
      .send(newWiki)
      .expect(201);

    expect(response.body.name).toBe(newWiki.name);
    expect(response.body.language).toBe(newWiki.language);
  });
});
