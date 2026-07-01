const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let accessToken;
let tenantId;
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

  // Register and login
  await request(app).post('/api/auth/register').send({
    name: 'Order Tester',
    email: 'orders@testshop.com',
    password: 'testPass123!',
    tenantName: 'Order Test Shop',
  });
  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'orders@testshop.com',
    password: 'testPass123!',
  });
  accessToken = loginRes.body.accessToken;
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

describe('Order state machine', () => {
  it('should reject invalid status transition', async () => {
    // Create a fake order id to test transition guard
    const Order = require('../server/models/Order');
    const order = new Order({
      tenantId: new mongoose.Types.ObjectId(),
      customerId: new mongoose.Types.ObjectId(),
      items: [],
      totalAmount: 0,
      status: 'DELIVERED',
      timeline: [],
    });
    expect(order.canTransitionTo('PENDING')).toBe(false);
    expect(order.canTransitionTo('RETURNED')).toBe(true);
  });

  it('should allow valid transition PENDING → CONFIRMED', () => {
    const Order = require('../server/models/Order');
    const order = new Order({
      tenantId: new mongoose.Types.ObjectId(),
      customerId: new mongoose.Types.ObjectId(),
      items: [],
      totalAmount: 0,
      status: 'PENDING',
      timeline: [],
    });
    expect(order.canTransitionTo('CONFIRMED')).toBe(true);
    expect(order.canTransitionTo('SHIPPED')).toBe(false);
  });
});
