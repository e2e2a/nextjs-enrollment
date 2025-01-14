'use server';
import dbConnect from './db';

export const clientPromise = async () => {
  try {
    const db = await dbConnect();
    const client = db.connection.getClient(); // Get the raw MongoClient
    console.log('MongoClient is ready');
    return client;
  } catch (error) {
    console.log('Database connection error:', error);
    return { success: false, message: 'Database connection failed' };
  }
};
