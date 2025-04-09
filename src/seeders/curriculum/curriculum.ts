'use server';
import Curriculum from '@/models/Curriculum';
import { curriculumData } from './curriculumData';

export const seedCurriculum = async () => {
  await Curriculum.deleteMany({});
  console.log('Cleaned Curriculum Collection');
  await Curriculum.insertMany(curriculumData);
  console.log('Curriculum seeding complete');
  return;
};
