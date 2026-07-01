const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Tenant = require('./models/Tenant');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');

// Beautiful Unsplash saree images for luxury styling
const SAREE_IMAGES = {
  kanchipuram: [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
  ],
  banarasi: [
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1610030470204-6334ef5102a0?auto=format&fit=crop&w=800&q=80'
  ],
  designer: [
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=800&q=80'
  ],
  cotton: [
    'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1617627143990-0b61655517f4?auto=format&fit=crop&w=800&q=80'
  ]
};

const seedData = async () => {
  try {
    console.log('Clearing existing database...');
    await Promise.all([
      Tenant.deleteMany({}),
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({})
    ]);

    console.log('Seeding Tenant...');
    const tenantId = new mongoose.Types.ObjectId();
    const ownerId = new mongoose.Types.ObjectId();

    const tenant = await Tenant.create({
      _id: tenantId,
      name: 'Sri Guru Kanmani Knots',
      subdomain: 'kanmani-knot',
      ownerId: ownerId,
      plan: 'pro',
      status: 'active',
      logoUrl: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=200&q=80',
      settings: {
        themeColor: '#722F37', // Wine Red / Maroon
        accentColor: '#D4AF37', // Metallic Gold
        contactEmail: 'contact@kanmaniknots.com',
        phone: '+91 98765 43210',
        currency: 'INR'
      }
    });

    console.log('Seeding Users (Admin and Customer)...');
    const hashedPassword = await bcrypt.hash('demo1234', 12);

    const admin = await User.create({
      _id: ownerId,
      tenantId: tenantId,
      email: 'demo@kanmaniknot.com',
      passwordHash: hashedPassword,
      name: 'Sri Guru Admin',
      phone: '+91 98765 43210',
      role: 'tenant_admin',
      isActive: true
    });

    const customerId = new mongoose.Types.ObjectId();
    const customer = await User.create({
      _id: customerId,
      tenantId: tenantId,
      email: 'customer@demo.com',
      passwordHash: hashedPassword,
      name: 'Sita Raman',
      phone: '+91 99999 88888',
      role: 'customer',
      isActive: true
    });

    console.log('Seeding Categories...');
    const catKanchi = await Category.create({
      tenantId,
      name: 'Kanchipuram Silk',
      slug: 'kanchipuram-silk',
      imageUrl: SAREE_IMAGES.kanchipuram[0]
    });

    const catBanarasi = await Category.create({
      tenantId,
      name: 'Banarasi Brocade',
      slug: 'banarasi-brocade',
      imageUrl: SAREE_IMAGES.banarasi[0]
    });

    const catDesigner = await Category.create({
      tenantId,
      name: 'Designer Tassels Special',
      slug: 'designer-tassels',
      imageUrl: SAREE_IMAGES.designer[0]
    });

    const catCotton = await Category.create({
      tenantId,
      name: 'Cotton & Linen Silk',
      slug: 'cotton-linen',
      imageUrl: SAREE_IMAGES.cotton[0]
    });

    console.log('Seeding Products...');
    
    // Product 1: Kanchipuram Silk Saree
    const p1 = await Product.create({
      tenantId,
      name: 'Valkalam Kanchipuram Pure Silk Saree',
      description: 'A masterpiece of weave featuring intricate gold zari brocade, pure mulberry silk, and hand-woven borders. Perfect for bridal events and grand celebrations. Custom tassel finish options included.',
      category: catKanchi._id,
      basePrice: 15500,
      images: SAREE_IMAGES.kanchipuram,
      isActive: true,
      tags: ['bridal', 'silk', 'kanchipuram', 'zari', 'premium'],
      ratings: { avg: 4.8, count: 12 },
      variants: [
        {
          sku: 'KNC-SILK-GLD-01',
          tasselType: 'Royal Kuchu Knot (Gold Zari)',
          colour: 'Crimson Red & Gold',
          weavePattern: 'Traditional Butta',
          zariWeight: '250g Pure Gold Zari',
          length: 6.2,
          price: 15500,
          stock: 5
        },
        {
          sku: 'KNC-SILK-SLV-02',
          tasselType: 'Pearl Bead Crochet (Silver Thread)',
          colour: 'Royal Blue & Silver',
          weavePattern: 'Floral Jal',
          zariWeight: '200g Silver Zari',
          length: 6.2,
          price: 14800,
          stock: 3
        }
      ]
    });

    // Product 2: Banarasi Georgette Saree
    const p2 = await Product.create({
      tenantId,
      name: 'Handwoven Banarasi Khaddi Georgette Saree',
      description: 'Lightweight pure georgette saree featuring intricate banarasi kadwa handloom work. Features beautiful designer fringe tassels.',
      category: catBanarasi._id,
      basePrice: 8500,
      images: SAREE_IMAGES.banarasi,
      isActive: true,
      tags: ['handloom', 'banarasi', 'georgette', 'floral'],
      ratings: { avg: 4.5, count: 8 },
      variants: [
        {
          sku: 'BAN-GEO-PNK-01',
          tasselType: 'Double Zari Flower Knot',
          colour: 'Magenta Pink & Zari',
          weavePattern: 'Jangla Pattern',
          zariWeight: 'Fine Tested Zari',
          length: 5.5,
          price: 8500,
          stock: 12
        },
        {
          sku: 'BAN-GEO-GRN-02',
          tasselType: 'Handmade Silk Thread Tassel',
          colour: 'Mint Green & Gold',
          weavePattern: 'Small Booti',
          zariWeight: 'Fine Tested Zari',
          length: 5.5,
          price: 8200,
          stock: 8
        }
      ]
    });

    // Product 3: Designer Tassel Special Saree
    const p3 = await Product.create({
      tenantId,
      name: 'Aura Premium Organza Designer Saree',
      description: 'Elegant organza saree with delicate hand-painted floral motifs and elaborate premium tassel fringes. Ideal for cocktail parties and evening events.',
      category: catDesigner._id,
      basePrice: 6200,
      images: SAREE_IMAGES.designer,
      isActive: true,
      tags: ['designer', 'organza', 'tassels', 'modern'],
      ratings: { avg: 4.9, count: 15 },
      variants: [
        {
          sku: 'DSG-ORG-PEACH',
          tasselType: 'Ring Ring Crochet Knot with Glass Beads',
          colour: 'Peach & Pastel Rose',
          weavePattern: 'Hand-painted Floral',
          zariWeight: 'None',
          length: 5.8,
          price: 6500,
          stock: 10
        },
        {
          sku: 'DSG-ORG-LAVENDER',
          tasselType: 'Cascade Bead Knot (Tassel Special)',
          colour: 'Lavender Mist',
          weavePattern: 'Gold Foil Border',
          zariWeight: '1g Border Zari',
          length: 5.8,
          price: 6200,
          stock: 6
        }
      ]
    });

    // Product 4: Cotton Linen Casual Saree
    const p4 = await Product.create({
      tenantId,
      name: 'Organic Cotton Linen Handloom Saree',
      description: 'Breathable, eco-friendly cotton-linen saree featuring sleek silver borders and simple, elegant thread tassels. Ideal for daily office wear or casual summer outings.',
      category: catCotton._id,
      basePrice: 3200,
      images: SAREE_IMAGES.cotton,
      isActive: true,
      tags: ['cotton', 'linen', 'daily', 'minimalist', 'handloom'],
      ratings: { avg: 4.2, count: 20 },
      variants: [
        {
          sku: 'COT-LIN-YEL-01',
          tasselType: 'Simple Cotton Thread Fringes',
          colour: 'Mustard Yellow & Grey',
          weavePattern: 'Striped Pallu',
          zariWeight: 'None',
          length: 5.5,
          price: 3200,
          stock: 25
        },
        {
          sku: 'COT-LIN-WHT-02',
          tasselType: 'Classic Tassel Border',
          colour: 'Off-White & Red',
          weavePattern: 'Plain Body with Solid Pallu',
          zariWeight: 'Minimal Zari Border',
          length: 5.5,
          price: 3500,
          stock: 15
        }
      ]
    });

    console.log('Seeding Sample Orders...');
    // Create some orders for customer
    const now = new Date();
    
    // Order 1: Delivered Order
    const orderDelivered = await Order.create({
      tenantId,
      customerId,
      items: [
        {
          productId: p1._id,
          variantSku: 'KNC-SILK-GLD-01',
          qty: 1,
          price: 15500,
          name: 'Valkalam Kanchipuram Pure Silk Saree (Crimson Red & Gold)'
        }
      ],
      totalAmount: 15500,
      status: 'DELIVERED',
      paymentInfo: {
        razorpayOrderId: 'rzp_seed_001',
        razorpayPaymentId: 'pay_seed_001',
        status: 'paid',
        paidAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
      },
      shippingAddress: {
        line1: 'Flat 402, Lotus Greens',
        line2: 'Jayanagar 4th Block',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560041',
        phone: '+91 99999 88888'
      },
      timeline: [
        { status: 'PENDING', note: 'Order placed', timestamp: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000) },
        { status: 'CONFIRMED', note: 'Payment verified', timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) },
        { status: 'PROCESSING', note: 'Knotting tassels & packaging', timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000) },
        { status: 'SHIPPED', note: 'Shipped via DTDC - AWB: 987654321', timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
        { status: 'DELIVERED', note: 'Delivered at doorstep', timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) }
      ]
    });

    // Order 2: Processing Order
    const orderProcessing = await Order.create({
      tenantId,
      customerId,
      items: [
        {
          productId: p2._id,
          variantSku: 'BAN-GEO-PNK-01',
          qty: 2,
          price: 8500,
          name: 'Handwoven Banarasi Khaddi Georgette Saree (Magenta Pink & Zari)'
        },
        {
          productId: p3._id,
          variantSku: 'DSG-ORG-PEACH',
          qty: 1,
          price: 6500,
          name: 'Aura Premium Organza Designer Saree (Peach & Pastel Rose)'
        }
      ],
      totalAmount: 23500,
      status: 'PROCESSING',
      paymentInfo: {
        razorpayOrderId: 'rzp_seed_002',
        razorpayPaymentId: 'pay_seed_002',
        status: 'paid',
        paidAt: new Date(now.getTime() - 12 * 60 * 60 * 1000)
      },
      shippingAddress: {
        line1: 'House 14, Ring Road',
        line2: 'T Nagar',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600017',
        phone: '+91 99999 88888'
      },
      timeline: [
        { status: 'PENDING', note: 'Order placed', timestamp: new Date(now.getTime() - 14 * 60 * 60 * 1000) },
        { status: 'CONFIRMED', note: 'Payment verified', timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000) },
        { status: 'PROCESSING', note: 'Handcrafting custom tassels', timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000) }
      ]
    });

    // Order 3: Pending Order
    const orderPending = await Order.create({
      tenantId,
      customerId,
      items: [
        {
          productId: p4._id,
          variantSku: 'COT-LIN-YEL-01',
          qty: 1,
          price: 3200,
          name: 'Organic Cotton Linen Handloom Saree (Mustard Yellow & Grey)'
        }
      ],
      totalAmount: 3200,
      status: 'PENDING',
      paymentInfo: {
        razorpayOrderId: 'rzp_seed_003',
        status: 'pending'
      },
      shippingAddress: {
        line1: 'Apartment 7B, Sky Towers',
        line2: 'Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        phone: '+91 99999 88888'
      },
      timeline: [
        { status: 'PENDING', note: 'Order initiated, awaiting payment verification', timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000) }
      ]
    });

    console.log('Seeding successfully completed!');
    return { tenantId, ownerId, customerId };

  } catch (err) {
    console.error('Seeding failed:', err.message);
    throw err;
  }
};

// If this file is run directly, execute seedData
if (require.main === module) {
  require('dotenv').config();
  const connectDB = require('./config/db');
  
  const run = async () => {
    // Override env variable to use a test/local DB if running standalone seed
    process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/saree-tassels';
    await connectDB();
    await seedData();
    mongoose.connection.close();
    process.exit(0);
  };
  run();
}

module.exports = { seedData };
