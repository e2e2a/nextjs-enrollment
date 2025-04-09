'use server';
import { hashPassword } from '@/lib/helpers/hash/bcrypt';
import { User } from '@/models/User';
import { faker } from '@faker-js/faker';
import { teacherProfileData } from './teacherProfileData';
import TeacherProfile from '@/models/TeacherProfile';

export const seedTeacherProfile = async () => {
  await User.deleteMany({ role: 'TEACHER' });
  await TeacherProfile.deleteMany({});
  console.log('Cleaned TeacherProfile Collection');

  const teacherProfilesWithNames = teacherProfileData.map(profile => ({
    ...profile,
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
  }));

  await TeacherProfile.insertMany(teacherProfilesWithNames);

  let i = 1;
  const password = 'qweqwe';
  const p = await hashPassword(password);
  for (const prof of teacherProfileData) {
    const email = `teacher${i}@gmail.com`;
    const teacher = new User({
      _id: prof.userId,
      email,
      username: `teacher${i}`,
      password: p,
      role: 'TEACHER',
      emailVerified: '2000-09-19T16:00:00.000Z',
    });
    await teacher.save();
  }
  console.log('TeacherProfile seeding complete');
  return;
};
