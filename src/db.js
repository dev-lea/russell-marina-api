import mongoose from 'mongoose';
import { env } from './config/env.js';

export async function connectDB() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGODB_URI);
  await mongoose.connection.db.admin().command({ ping: 1 });
  return mongoose.connection;
}
