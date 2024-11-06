const request = require('supertest');
const app = require('../src/apps/app');
const mongoose = require('mongoose');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin@localhost:27017/laWiki?authSource=admin';

describe('Basic Tests', () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(MONGODB_URI);
    server = app.listen(PORT);
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
});
