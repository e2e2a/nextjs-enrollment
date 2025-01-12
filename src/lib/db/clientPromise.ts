import dbConnect from "./db";

export const clientPromise = dbConnect().then((mongoose) => {
  const client = mongoose.connection.getClient(); // Get the raw MongoClient
  console.log('MongoClient is ready');
  return client;
});