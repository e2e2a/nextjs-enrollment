'use server';
import { hashPassword } from '@/lib/helpers/hash/bcrypt';
import { User } from '@/models/User';
import { deanProfileData } from './deanProfileData';
import { faker } from '@faker-js/faker';
import DeanProfile from '@/models/DeanProfile';

export const seedDeanProfile = async () => {
  await User.deleteMany({ role: 'DEAN' });
  await DeanProfile.deleteMany({});
  console.log('Cleaned DeanProfile Collection');

  const deanProfilesWithNames = deanProfileData.map(profile => ({
    ...profile,
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
  }));

  await DeanProfile.insertMany(deanProfilesWithNames);

  let i = 1;
  const password = 'qweqwe';
  const p = await hashPassword(password);
  for (const prof of deanProfileData) {
    const email = `dean${i}@gmail.com`;
    const dean = new User({
      _id: prof.userId,
      email,
      username: `dean${i}`,
      password: p,
      role: 'DEAN',
      emailVerified: '2000-09-19T16:00:00.000Z',
    });
    await dean.save();
  }
  console.log('DeanProfile seeding complete');
  return;
};
