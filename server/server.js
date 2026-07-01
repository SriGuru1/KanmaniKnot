const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const adminRoutes = require('./routes/adminRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Connect DB & Auto-Seed ────────────────────────────────
connectDB().then(async () => {
  if (process.env.NODE_ENV === 'test') {
    return; // Don't auto-seed in test environment to avoid connection conflict
  }
  
  try {
    const Tenant = require('./models/Tenant');
    const count = await Tenant.countDocuments();
    if (count === 0) {
      console.log('No tenants found in database. Initializing automatic seed...');
      const { seedData } = require('./seed');
      await seedData();
    } else {
      console.log(`Database already has ${count} tenant(s). Skipping seed.`);
    }
  } catch (err) {
    console.error('Error during database auto-seed check:', err.message);
  }
});

// ── Global Middleware ─────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ── Rate Limiting (auth endpoints) ────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  message: { error: 'Too many requests from this IP, please try again later.' },
});

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);

// ── Health Check ──────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', ts: new Date() }));

// ── Centralised Error Handler ─────────────────────────────
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`));
}

module.exports = app; // for supertest
