import mongoose from 'mongoose';
import { CONFIG } from './env.js';

export const connectDB = async (): Promise<typeof mongoose> => {
  mongoose.connection.on('error', (err: Error) => {
    console.error('MongoDB connection error', err);
  });

  mongoose.connection.on('disconnected', (): void => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
  });

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required but not provided in environment variables');
  }

  try {
    const connection = await mongoose.connect(CONFIG.MONGODB_URI);

    console.log(`MongoDB connected: ${connection.connection.host}`);

    return connection;
  } catch (err) {
    console.error(
      'Error connecting to MongoDB:',
      err instanceof Error ? err.message : 'Unknown error',
    );
    process.exit(1);
  }
};
