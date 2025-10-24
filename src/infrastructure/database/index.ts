import mongoose from "mongoose";
import logger from "../logger/winston";

// Export the mongoose instance
export const db = mongoose;

// Connection state tracking
let isConnected = false;

// Connection events
mongoose.connection.on('connected', () => {
  isConnected = true;
  logger.info('✅ MongoDB connected successfully!');
  logger.info(`📊 MongoDB connected to: ${mongoose.connection.host}:${mongoose.connection.port}/${mongoose.connection.name}`);
});

mongoose.connection.on('error', (err) => {
  logger.error('❌ MongoDB connection error:', err);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️ MongoDB disconnected');
  isConnected = false;
});

// Close the connection when the application is terminated
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    logger.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URL;

  if (!mongoUri) {
    logger.error(
      '❌ MONGO_URL environment variable not set. Please check your .env file.'
    );
    process.exit(1);
  }

  // Skip if already connected
  if (isConnected) {
    logger.info('ℹ️ MongoDB is already connected');
    return;
  }

  try {
    logger.info('🔄 Attempting to connect to MongoDB...');
    logger.debug(`🔗 Connection URI: ${mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    // Log connection status
    logger.info(`📡 MongoDB connection state: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    logger.info(`💾 Database name: ${mongoose.connection.name}`);
    
    // Safely log collections if connection is established
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      const collectionNames = collections.map((c: any) => c.name).join(', ') || 'None';
      logger.info(`👥 Collections: ${collectionNames}`);
    } else {
      logger.warn('⚠️ Database instance not available');
    }
    
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
