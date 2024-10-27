const request = require('supertest');
const app = require('../src/apps/app');
const mongoose = require('mongoose');

describe('POST /wiki', () => {
  let server;

  // Start the server before all tests
  beforeAll(() => {
    server = app.listen(3000, () => {
      console.log('Test server running on port 3000');
    });
  });

  // Close the server and MongoDB connection after all tests
  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  it('should create a new wiki entry', async () => {
    const newWiki = {
      name: "Programming Wiki",
      description: "A wiki about programming languages.",
      createdBy: "60d21b4667d0d8992e610c85",  // Replace with a valid ObjectId
      categories: ["Tech", "Programming"],
      language: "en"
    };

    const response = await request(server)
      .post('/wiki')
      .send(newWiki)
      .expect(201);

    expect(response.body.name).toBe(newWiki.name);
    expect(response.body.language).toBe(newWiki.language);
  });
});
