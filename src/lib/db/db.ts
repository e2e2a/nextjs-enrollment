// @ts-nocheck
'use server';
import mongoose from 'mongoose';
import initializeModel from './initialize';
async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI || '';
  // console.log(`Connecting to database at: ${MONGODB_URI}`);

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  // Use global cache to store connection
  if (global.mongoose && global.mongoose.conn) {
    return global.mongoose.conn;
  }

  // Create a new connection if not already cached
  if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null, initialized: false };
  }

  // Set options for connection
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false, // Disable buffering
  };

  // Create and cache the connection promise
  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(async (mongooseInstance) => {
        // Add all your models here
        console.log('Connected to MongoDB');
        // Initialize models only on the first connection
        if (!global.mongoose.initialized) {
          const modelsToInitialize = ['Course', 'User', 'StudentProfile', 'Account', 'Enrollment', 'BlockType', 'Subject', 'TeacherProfile', 'TeacherSchedule', 'Room', 'SchoolYear','Curriculum', 'StudentCurriculum'];
          await initializeModel(modelsToInitialize);
          global.mongoose.initialized = true;
        }
        return mongooseInstance;
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err);
        throw err;
      });
  }

  try {
    global.mongoose.conn = await global.mongoose.promise;
  } catch (e) {
    global.mongoose.promise = null; // Clear the promise in case of failure
    throw e;
  }

  return global.mongoose.conn;
}

export default dbConnect;

// import mongoose from 'mongoose';

// let isConnected = false;
// let connection = null;

// async function dbConnect() {
//   if (isConnected) {
//     console.log('Using existing database connection');
//     return connection;
//   }

//   try {
//     const db = await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     isConnected = db.connections[0].readyState;
//     connection = db;

//     console.log('New database connection');
//     return connection;
//   } catch (error) {
//     console.error('MongoDB connection error:', error.message);
//     throw new Error('Database connection error');
//   }
// }

// export default dbConnect;
