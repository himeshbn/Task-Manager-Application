const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

// Increase timeout for CI environments where MongoDB may be slow to connect
jest.setTimeout(15000);

// Close DB connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

// ─── Health Check ────────────────────────────────────────────────────────────
describe('GET /api/health', () => {
  it('should return 200 with status message', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('timestamp');
  });
});

// ─── Auth Routes — Validation ────────────────────────────────────────────────
describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should reject registration with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@test.com' }); // Missing name and password

      expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    it('should reject registration with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'not-an-email',
          password: 'password123',
        });

      expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    it('should reject registration with short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@test.com',
          password: '123', // Too short
        });

      expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should reject login with missing credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    it('should reject login with non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123',
        });

      expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
  });
});

// ─── Task Routes — Auth Protection ──────────────────────────────────────────
describe('Task Routes', () => {
  it('GET /api/tasks should return 401 without token', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  it('POST /api/tasks should return 401 without token', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task' });

    expect(res.statusCode).toBe(401);
  });
});

// ─── 404 Handler ────────────────────────────────────────────────────────────
describe('404 Handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/nonexistent-route');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Route not found');
  });
});
