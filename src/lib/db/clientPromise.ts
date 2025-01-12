// @ts-nocheck
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error('Please add your Mongo URI to the environment variables');
}

// Use a global variable in development to prevent creating multiple instances during hot reloads
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, { serverSelectionTimeoutMS: 55000 });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise as Promise<MongoClient>;
} else {
  // In production, create a new client instance
  client = new MongoClient(uri, { serverSelectionTimeoutMS: 55000 });

  try {
    clientPromise = client.connect();
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export default clientPromise;
