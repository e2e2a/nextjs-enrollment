'use server';
import Scholarship from '@/models/Scholarship';
import { scholarshipData } from './scholarshipData';

export const seedScholarship = async () => {
  await Scholarship.deleteMany({});
  console.log('Cleaned Scholarship Collection');
  await Scholarship.insertMany(scholarshipData);
  console.log('Scholarship seeding complete');
  return;
};
