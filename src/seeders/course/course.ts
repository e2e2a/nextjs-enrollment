'use server';
import Course from '@/models/Course';
import { courseData } from './courseData';

export const seedCourse = async () => {
  await Course.deleteMany({});
  console.log('Cleaned Course Collection');
  await Course.insertMany(courseData);
  console.log('Course seeding complete');
  return;
};
