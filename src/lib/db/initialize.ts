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
import Curriculum from '@/models/Curriculum';
import StudentCurriculum from '@/models/StudentCurriculum';
import StudentSchedule from '@/models/StudentSchedule';
import { UserIp } from '@/models/UserIp';
import AdminProfile from '@/models/AdminProfile';
import DeanProfile from '@/models/DeanProfile';
import EnrollmentSetup from '@/models/EnrollmentSetup';
import ReportGrade from '@/models/ReportGrade';
import EnrollmentRecord from '@/models/EnrollmentRecord';
import TeacherScheduleRecord from '@/models/TeacherScheduleRecord';
import { Session } from '@/models/Sessions';
import AccountingProfile from '@/models/AccountingProfile';

type ModelName =
  | 'Session'
  | 'Course'
  | 'User'
  | 'UserIp'
  | 'StudentProfile'
  | 'Account'
  | 'Enrollment'
  | 'BlockType'
  | 'Subject'
  | 'TeacherProfile'
  | 'TeacherSchedule'
  | 'Room'
  | 'Curriculum'
  | 'StudentCurriculum'
  | 'StudentSchedule'
  | 'AdminProfile'
  | 'DeanProfile'
  | 'EnrollmentSetup'
  | 'ReportGrade'
  | 'EnrollmentRecord'
  | 'TeacherScheduleRecord'
  | 'AccountingProfile';

const modelsMap: Record<ModelName, mongoose.Model<any>> = {
  Session,
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
  Curriculum,
  StudentCurriculum,
  StudentSchedule,
  AdminProfile,
  DeanProfile,
  EnrollmentSetup,
  ReportGrade,
  EnrollmentRecord,
  TeacherScheduleRecord,
  AccountingProfile,
};
let isInitialized = false;
const initializeModel = async (modelNames: ModelName[]) => {
  if (isInitialized) return;
  for (const name of modelNames) {
    const model = modelsMap[name];
    if (!model) {
      throw new Error(`Unknown model: ${name}`);
    }

    await model.countDocuments();
  }
};

export default initializeModel;
