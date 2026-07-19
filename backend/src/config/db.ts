import mongoose from 'mongoose';

const buildMongoUri = () => {
  // Allow a full URI override if provided (useful for Atlas, etc.)
  if (process.env.MONGO_URI) return process.env.MONGO_URI;

  const host = process.env.MONGO_HOST || 'localhost';
  const port = process.env.MONGO_PORT || '27017';
  const db = process.env.MONGO_DB || 'mernapp';
  const user = process.env.MONGO_USER;
  const password = process.env.MONGO_PASSWORD;

  if (user && password) {
    return `mongodb://${user}:${password}@${host}:${port}/${db}?authSource=admin`;
  }
  return `mongodb://${host}:${port}/${db}`;
};

const connectDB = async () => {
  const uri = buildMongoUri();
  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected -> ${process.env.MONGO_HOST || 'localhost'}:${process.env.MONGO_PORT || '27017'}`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('MongoDB connection error:', message);
    // Retry after a delay - useful when DB pod isn't ready yet in k8s
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
