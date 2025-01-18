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

export default clientPromise;
