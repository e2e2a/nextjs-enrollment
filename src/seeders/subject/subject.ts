'use server';
import Subject from '@/models/Subject';
import { subjectData } from './subjectData';

export const seedSubject = async () => {
  await Subject.deleteMany({});
  console.log('Cleaned Subject Collection');
  await Subject.insertMany(subjectData);
  return console.log('Subject seeding complete');
};

seedSubject();
