import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let mongoUri: string | undefined;

const connectDB = async (): Promise<void> => {
  try {
    mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-shop';
    
    // Try to connect to the provided MongoDB URI
    await mongoose.connect(mongoUri, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected successfully');
  } catch (error: any) {
    // If connection fails and we're in development, try in-memory MongoDB
    if (process.env.NODE_ENV === 'development' && error.message.includes('connect ECONNREFUSED')) {
      console.warn('Local MongoDB not available, starting in-memory MongoDB...');
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        
        await mongoose.connect(mongoUri);
        console.log('In-memory MongoDB started successfully');
      } catch (memoryError) {
        console.error('Failed to start in-memory MongoDB:', memoryError);
        process.exit(1);
      }
    } else {
      console.error('MongoDB connection failed:', error);
      process.exit(1);
    }
  }
};

export default connectDB;
