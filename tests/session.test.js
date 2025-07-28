const request = require('supertest');
const express = require('express');
const sessionRoutes = require('../src/routes/sessions');
const { authenticateApiKey } = require('../src/middleware/auth');

const app = express();
app.use(express.json());
app.use('/api/sessions', authenticateApiKey, sessionRoutes);

// Mock environment variables
process.env.API_KEY = 'test-api-key';

describe('Session Routes', () => {
  test('POST /api/sessions should create a session', async () => {
    const response = await request(app)
      .post('/api/sessions')
      .set('x-api-key', 'test-api-key')
      .send({ name: 'Test Session' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test Session');
  });

  test('POST /api/sessions should fail without API key', async () => {
    const response = await request(app)
      .post('/api/sessions')
      .send({ name: 'Test Session' });

    expect(response.status).toBe(401);
  });
});