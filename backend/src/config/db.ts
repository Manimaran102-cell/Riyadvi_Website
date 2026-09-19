import mongoose from 'mongoose';
import { env } from './env';

mongoose.set('strictQuery', true);
// Fail fast instead of silently queueing writes when the DB is down.
mongoose.set('bufferCommands', false);

export async function connectDB(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  console.log('MongoDB connected');
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
