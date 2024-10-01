// @ts-nocheck
'use server';
import mongoose from 'mongoose';
import initializeModel from './initialize';

const MONGODB_URI = process.env.MONGODB_URI;
const modelsToInitialize = ['Course', 'User', 'UserIp', 'StudentProfile', 'Account', 'Enrollment', 'BlockType', 'Subject', 'TeacherProfile', 'TeacherSchedule', 'Room', 'SchoolYear', 'Curriculum', 'StudentCurriculum', 'StudentSchedule', 'AdminProfile', 'DeanProfile', 'EnrollmentSetup'];
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
      await initializeModel(modelsToInitialize);
      return mongoose;
    }).catch(err => {console.log('err', err);});
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
