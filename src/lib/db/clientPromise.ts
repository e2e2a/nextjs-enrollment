import { MongoClient } from 'mongodb';
let cachedClient: MongoClient | null = null;

const clientPromise = async (): Promise<MongoClient> => {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI!, {
      connectTimeoutMS: 59999, // Connection timeout in milliseconds
      socketTimeoutMS: 360000, // Socket timeout in milliseconds
      maxPoolSize: 100, // Maximum number of connections in the pool
      minPoolSize: 10, // Minimum number of connections in the pool
      waitQueueTimeoutMS: 59000, // How long to wait for a connection from the pool
    });

    const dbclient = await client.connect();
    console.log('Connected to MongoDB');
    cachedClient = dbclient;
    // console.log('dbClient', dbclient)
    return dbclient;
  } catch (err: any) {
    console.log('MongoDB connection error:', err);
    return err;
  }
};

const connectWithRetry = async (retries = 5, delay = 5000) => {
  try {
    const a = await clientPromise();
    if (!a || a === null) throw new Error('error a is null');
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying MongoDB connection... (${retries} retries left)`);
      setTimeout(() => connectWithRetry(retries - 1, delay), delay);
    } else {
      console.log('MongoDB connection failed after multiple retries:', error);
      return error;
      // process.exit(1); // Exit if the retries are exhausted
    }
  }
};
export default clientPromise;
