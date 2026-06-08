const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server/server');

let accessToken;
let tenantId;

beforeAll(async () => {
  const uri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/saree-tassels-test';
  if (mongoose.connection.readyState === 0) await mongoose.connect(uri);

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
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
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
