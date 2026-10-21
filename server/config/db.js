import mongoose from 'mongoose';
import { env } from './env.js';

export default async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    // Never print the connection string - it contains your password.
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}
