import dbConnect from './db';

export const clientPromise = dbConnect().then((mongoose) => {
  try {
    const client = mongoose.connection.getClient(); // Get the raw MongoClient
    console.log('MongoClient is ready');
    return client;
  } catch (error) {
    console.log('Database connection error:', error);
    return { success: false, message: 'Database connection failed' };
  }
});
