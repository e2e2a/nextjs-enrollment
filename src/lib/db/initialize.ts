'use server';
import mongoose from 'mongoose';
import Course from '@/models/Course';
import { User } from '@/models/User';
import StudentProfile from '@/models/StudentProfile';
import Account from '@/models/Account';
import Enrollment from '@/models/Enrollment';
import BlockType from '@/models/BlockType';
import Subject from '@/models/Subject';
import TeacherProfile from '@/models/TeacherProfile';
import TeacherSchedule from '@/models/TeacherSchedule';
import Room from '@/models/Room';
import SchoolYear from '@/models/SchoolYear';
import Curriculum from '@/models/Curriculum';
import StudentCurriculum from '@/models/StudentCurriculum';
import StudentSchedule from '@/models/StudentSchedule';
import { UserIp } from '@/models/UserIp';

type ModelName = 'Course' | 'User' | 'UserIp' | 'StudentProfile' | 'Account' | 'Enrollment' | 'BlockType' | 'Subject' | 'TeacherProfile' | 'TeacherSchedule' | 'Room' | 'SchoolYear' | 'Curriculum' | 'StudentCurriculum' | 'StudentSchedule';

const modelsMap: Record<ModelName, mongoose.Model<any>> = {
  Course,
  User,
  UserIp,
  StudentProfile,
  Account,
  Enrollment,
  BlockType,
  Subject,
  TeacherProfile,
  TeacherSchedule,
  Room,
  SchoolYear,
  Curriculum,
  StudentCurriculum,
  StudentSchedule,
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
