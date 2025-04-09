'use server';
import CourseFeeRecord from '@/models/CourseFeeRecord';
import { courseFeeRecordData } from './courseFeeRecordData';

export const seedCourseFeeRecord = async () => {
  await CourseFeeRecord.deleteMany({});
  console.log('Cleaned CourseFee Record Collection');
  await CourseFeeRecord.insertMany(courseFeeRecordData);
  console.log('CourseFee Record seeding complete');
  return;
};
