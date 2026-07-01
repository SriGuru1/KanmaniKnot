const mongoose = require('mongoose');

let mongoServer;

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;
    
    if (!uri && process.env.NODE_ENV !== 'test') {
      console.log('MONGO_URI not set. Initializing in-memory MongoDB server...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log(`In-memory MongoDB started at: ${uri}`);
    }

    if (!uri) {
      throw new Error('MONGO_URI is required but was not provided');
    }

    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
