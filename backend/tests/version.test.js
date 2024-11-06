const request = require('supertest');
const app = require('../src/apps/app');
const mongoose = require('mongoose');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin@localhost:27017/laWiki?authSource=admin';

describe('Version Tests', () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(MONGODB_URI);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
  });

  let versionId; // Guardará el ID de una versión creada para pruebas posteriores

  it('should create a new version', async () => {
    const newVersion = {
      entry: "123456789012345678901234", // Reemplaza con un ObjectId válido
      content: "Contenido de prueba para una Versión de prueba",
      createdBy: "123456789012345678901234" // Reemplaza con un ObjectId válido
    };

    const response = await request(app)
      .post('/versions')
      .send(newVersion)
      .expect(201);

    expect(response.body.content).toBe(newVersion.content);
    versionId = response.body._id; // Guarda el ID para futuros tests
  });

  it('should get all versions', async () => {
    const response = await request(app).get('/versions').expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get a version by ID', async () => {
    const response = await request(app).get(`/versions/${versionId}`).expect(200);
    expect(response.body._id).toBe(versionId);
  });

  it('should update a version by ID', async () => {
    const updatedContent = { content: "Updated version content." };

    const response = await request(app)
      .put(`/versions/${versionId}`)
      .send(updatedContent)
      .expect(200);

    expect(response.body.content).toBe(updatedContent.content);
  });

  it('should delete a version by ID', async () => {
    await request(app).delete(`/versions/${versionId}`).expect(200);
    const response = await request(app).get(`/versions/${versionId}`).expect(404);
    expect(response.body).toBe('Version not found');
  });
});