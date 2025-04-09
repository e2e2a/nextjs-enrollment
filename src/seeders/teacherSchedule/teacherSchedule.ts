'use server';
import TeacherSchedule from '@/models/TeacherSchedule';
import { teacherScheduleData } from './teacherScheduleData';

export const seedTeacherSchedule = async () => {
  await TeacherSchedule.deleteMany({});
  console.log('Cleaned Subject Collection');
  await TeacherSchedule.insertMany(teacherScheduleData);
  return console.log('Subject seeding complete');
};

seedTeacherSchedule();
