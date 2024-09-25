// @ts-nocheck
'use server';
// import mongoose from 'mongoose';
// import initializeModel from './initialize';
// async function dbConnect() {
//   const MONGODB_URI = process.env.MONGODB_URI || '';
//   // console.log(`Connecting to database at: ${MONGODB_URI}`);

//   if (!MONGODB_URI) {
//     throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
//   }

//   // Use global cache to store connection
//   if (global.mongoose && global.mongoose.conn) {
//     return global.mongoose.conn;
//   }

//   // Create a new connection if not already cached
//   if (!global.mongoose) {
//     global.mongoose = { conn: null, promise: null, initialized: false };
//   }

//   // Set options for connection
//   const opts = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     bufferCommands: false, // Disable buffering
//   };

//   // Create and cache the connection promise
//   if (!global.mongoose.promise) {
//     global.mongoose.promise = mongoose
//       .connect(MONGODB_URI, opts)
//       .then(async (mongooseInstance) => {
//         // Add all your models here
//         console.log('Connected to MongoDB');
//         // Initialize models only on the first connection
//         if (!global.mongoose.initialized) {
//           const modelsToInitialize = ['Course', 'User', 'UserIp', 'StudentProfile', 'Account', 'Enrollment', 'BlockType', 'Subject', 'TeacherProfile', 'TeacherSchedule', 'Room', 'SchoolYear', 'Curriculum', 'StudentCurriculum', 'StudentSchedule', 'AdminProfile'];
//           await initializeModel(modelsToInitialize);
//           global.mongoose.initialized = true;
//         }
//         return mongooseInstance;
//       })
//       .catch((err) => {
//         console.error('MongoDB connection error:', err);
//         throw err;
//       });
//   }

//   try {
//     global.mongoose.conn = await global.mongoose.promise;
//   } catch (e) {
//     global.mongoose.promise = null; // Clear the promise in case of failure
//     throw e;
//   }

//   return global.mongoose.conn;
// }

// export default dbConnect;

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

// import mongoose from 'mongoose';

// async function dbConnect() {
//   const MONGODB_URI = process.env.MONGODB_URI || '';

//   if (!MONGODB_URI) {
//     throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
//   }

//   // Check if the connection is cached
//   if (global.mongoose && global.mongoose.conn) {
//     return global.mongoose.conn;
//   }

//   // Initialize global connection cache
//   if (!global.mongoose) {
//     global.mongoose = { conn: null, promise: null, initialized: false };
//   }

//   // MongoDB connection options
//   const opts = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     bufferCommands: false, // Disable mongoose buffering for fast failure
//     serverSelectionTimeoutMS: 5000, // Short timeout to fail fast if MongoDB is unreachable
//   };

//   // If no connection promise exists, create it
//   if (!global.mongoose.promise) {
//     global.mongoose.promise = mongoose
//       .connect(MONGODB_URI, opts)
//       .then(async (mongooseInstance) => {
//         console.log('Connected to MongoDB');

//         // Initialize models only once globally
//         if (!global.mongoose.initialized) {
//           const modelsToInitialize = ['Course', 'User', 'UserIp', 'StudentProfile', 'Account', 'Enrollment', 'BlockType', 'Subject', 'TeacherProfile', 'TeacherSchedule', 'Room', 'SchoolYear', 'Curriculum', 'StudentCurriculum', 'StudentSchedule', 'AdminProfile'];
//           await initializeModel(modelsToInitialize);
//           global.mongoose.initialized = true;
//         }

//         return mongooseInstance;
//       })
//       .catch((err) => {
//         console.error('MongoDB connection error:', err);
//         global.mongoose.promise = null; // Reset promise on failure
//         throw err; // Propagate the error so it can be handled by the caller
//       });
//   }

//   // Wait for the connection to resolve
//   try {
//     global.mongoose.conn = await global.mongoose.promise;
//   } catch (e) {
//     global.mongoose.promise = null; // Clear the promise if connection failed
//     throw e; // Throw error to be caught by calling function
//   }

//   return global.mongoose.conn;
// }

// export default dbConnect;
import mongoose from 'mongoose';
import initializeModel from './initialize';

const MONGODB_URI = process.env.MONGODB_URI;
const modelsToInitialize = ['Course', 'User', 'UserIp', 'StudentProfile', 'Account', 'Enrollment', 'BlockType', 'Subject', 'TeacherProfile', 'TeacherSchedule', 'Room', 'SchoolYear', 'Curriculum', 'StudentCurriculum', 'StudentSchedule', 'AdminProfile'];
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(async (mongoose) => {
      // console.log('Attempting to connect to MongoDB');
      await initializeModel(modelsToInitialize);
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
