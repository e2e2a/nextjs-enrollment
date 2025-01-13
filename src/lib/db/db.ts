// @ts-nocheck
'use server';
import mongoose from 'mongoose';
import initializeModel from './initialize';

const MONGODB_URI = process.env.MONGODB_URI;
const modelsToInitialize = [
  'Session',
  'Course',
  'User',
  'UserIp',
  'StudentProfile',
  'Account',
  'Enrollment',
  'BlockType',
  'Subject',
  'TeacherProfile',
  'TeacherSchedule',
  'Room',
  'Curriculum',
  'StudentCurriculum',
  'StudentSchedule',
  'AdminProfile',
  'DeanProfile',
  'EnrollmentSetup',
  'ReportGrade',
  'EnrollmentRecord',
  'TeacherScheduleRecord',
  'AccountingProfile',
  'ReportGradeRecord',
  'TuitionFee',
];
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // const start = Date.now();
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 55000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(async (mongoose) => {
        try {
          await initializeModel(modelsToInitialize);
          const dbStats = await mongoose.connection.db.command({ ping: 1 });
          /**
           * @test
           * @return ping
           */
          // console.log('Ping result:', dbStats);  // Log the ping result
          // const end = Date.now();
          // console.log(`Ping took ${end - start} ms`);
          return mongoose;
        } catch (err) {
          console.error('Error during model initialization or ping:', err);
          throw err;
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
