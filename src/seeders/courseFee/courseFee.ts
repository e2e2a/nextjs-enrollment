'use server';
import CourseFee from '@/models/CourseFee';
import { courseFeeData } from './courseFeeData';

export const seedCourseFee = async () => {
  await CourseFee.deleteMany({});
  console.log('Cleaned CourseFee Collection');
  await CourseFee.insertMany(courseFeeData);
  console.log('CourseFee seeding complete');
  return;
};
