'use server';
import { enrollmentData } from './enrollmentData';
import Enrollment from '@/models/Enrollment';

export const seedEnrollment = async () => {
  await Enrollment.deleteMany({});
  console.log('Cleaned Enrollment Collection');
  await Enrollment.insertMany(enrollmentData);
  console.log('Enrollment seeding complete');
  return;
};
