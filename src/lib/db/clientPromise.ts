// @ts-nocheck
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error('Please add your Mongo URI to the environment variables');
}

// Retry logic for connecting to MongoDB
const connectWithRetry = async (uri: string, options: any, retries = 5): Promise<MongoClient> => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const client = new MongoClient(uri, options);
      return await client.connect(); // Successfully connected, return the connected client
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt + 1} failed:`, error);
      attempt++;
      if (attempt >= retries) throw error; // Rethrow error if retries are exhausted
      await new Promise((res) => setTimeout(res, 5000)); // Wait 5 seconds before retrying
    }
  }
  throw new Error('Failed to connect to MongoDB after retries');
};

// Use a global variable in development to prevent creating multiple instances during hot reloads
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = connectWithRetry(uri, { serverSelectionTimeoutMS: 55000 });
  }
  clientPromise = global._mongoClientPromise as Promise<MongoClient>;
} else {
  // In production, create a new client instance
  try {
    clientPromise = connectWithRetry(uri, { serverSelectionTimeoutMS: 55000 });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export default clientPromise;
