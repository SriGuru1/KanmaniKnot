const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();
  
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(process.env.MONGO_URI);
  
  // Require app only after setting MONGO_URI
  app = require('../server/server');
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
  delete process.env.MONGO_URI;
});

describe('POST /api/auth/register', () => {
  it('should register a new tenant and owner', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Owner',
      email: 'owner@testboutique.com',
      password: 'securePass123!',
      tenantName: 'Test Boutique',
      plan: 'trial',
    });
    expect(res.status).toBe(201);
    expect(res.body.tenant).toBeDefined();
    expect(res.body.user.email).toBe('owner@testboutique.com');
  });

  it('should reject duplicate subdomain', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Another Owner',
      email: 'other@testboutique.com',
      password: 'securePass123!',
      tenantName: 'Test Boutique',
    });
    expect(res.status).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'owner@testboutique.com',
      password: 'securePass123!',
    });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'owner@testboutique.com',
      password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
  });
});
