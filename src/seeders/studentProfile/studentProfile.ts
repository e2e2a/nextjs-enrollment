'use server';
import { hashPassword } from '@/lib/helpers/hash/bcrypt';
import { studentProfileData } from './studentProfileData';
import StudentProfile from '@/models/StudentProfile';
import { User } from '@/models/User';
import { faker } from '@faker-js/faker';

export const seedStudentProfile = async () => {
  await User.deleteMany({ role: 'STUDENT' });
  await StudentProfile.deleteMany({});
  console.log('Cleaned StudentProfile Collection');
  const studentProfileDataFakeNames = studentProfileData.map(data => {
    return {
      ...data,
      firstname: faker.person.firstName(),
      middlename: '',
      lastname: faker.person.lastName(),
      extensionName: '',
    };
  });

  await StudentProfile.insertMany(studentProfileDataFakeNames);
  let i = 1;
  const password = 'qweqwe';
  const p = await hashPassword(password);
  for (const prof of studentProfileData) {
    const studentEmail = `student${i}@gmail.com`;
    const student = new User({
      _id: prof.userId,
      email: studentEmail,
      username: `student${i}`,
      password: p,
      role: 'STUDENT',
      emailVerified: '2000-09-19T16:00:00.000Z',
    });
    await student.save();
  }
  console.log('StudentProfile seeding complete');
  return;
};
