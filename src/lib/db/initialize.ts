'use server';
import mongoose from 'mongoose';
import Course from '@/models/Course';
import { User } from '@/models/User';
import StudentProfile from '@/models/StudentProfile';
import Account from '@/models/Account';
import Enrollment from '@/models/Enrollment';

type ModelName = 'Course' | 'User' | 'StudentProfile' | 'Account' | 'Enrollment';

const modelsMap: Record<ModelName, mongoose.Model<any>> = {
  Course,
  User,
  StudentProfile,
  Account,
  Enrollment,
};

const initializeModel = async (modelNames: ModelName[]) => {
    for (const name of modelNames) {
      const model = modelsMap[name];
      if (!model) {
        throw new Error(`Unknown model: ${name}`);
      }
      
      // Force model initialization by executing a dummy query
      await model.findOne();
      console.log(`${name} model initialized`);
    }
  };

export default initializeModel;
