const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer = null;

const connectDB = async () => {
  try {
    // Attempt to connect to standard MONGO_URI with a 3-second timeout
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gymflow', {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Local/Cloud Database connection failed: ${error.message}`);

    try {
      console.log('Attempting connection to local portable MongoDB at mongodb://localhost:27017/gymflow ...');
      const conn = await mongoose.connect('mongodb://localhost:27017/gymflow', {
        serverSelectionTimeoutMS: 3000
      });
      console.log(`Local MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (localDbError) {
      console.warn(`Local MongoDB connection failed: ${localDbError.message}`);
    }

    console.log('Spinning up an automated, secure In-Memory MongoDB Server instead...');

    try {
      // Create and start the in-memory database instance
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();

      const conn = await mongoose.connect(mongoUri);
      console.log(`In-Memory MongoDB Connected Successfully! URL: ${mongoUri}`);

      // Auto-seed the database
      console.log('Auto-seeding in-memory database...');
      const seedData = require('../seed/seed');
      await seedData(false);
      console.log('In-memory database seeded successfully!');
    } catch (inMemError) {
      console.error(`Failed to launch or seed In-Memory Database: ${inMemError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
