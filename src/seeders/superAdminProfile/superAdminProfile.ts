'use server';
import SuperAdminProfile from '@/models/SuperAdminProfile';
import { hashPassword } from '../../lib/helpers/hash/bcrypt';
import { User } from '../../models/User';
import { faker } from '@faker-js/faker';

export const seedSuperAdminProfile = async () => {
  await User.deleteMany({ role: 'SUPER ADMIN' });
  await SuperAdminProfile.deleteMany({});
  console.log('Cleaned SuperAdminProfile complete');

  const password = 'qweqwe';
  const p = await hashPassword(password);
  for (let i = 0; i < 10; i++) {
    const email = `superadmin${i}@gmail.com`;
    const superadmin = new User({
      email,
      username: `superadmin${i}`,
      password: p,
      role: 'SUPER ADMIN',
      emailVerified: '2000-09-19T16:00:00.000Z',
    });
    await superadmin.save();

    // Generate a random firstname and lastname
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const superAdminProfile = new SuperAdminProfile({
      userId: superadmin._id,
      age: '30',
      birthday: '2000-09-19T16:00:00.000Z',
      cityMunicipality: 'qweqwe',
      civilStatus: 'single',
      contact: '09123456789',
      emailFbAcc: '',
      extensionName: '',
      firstname: `${firstName}`,
      middlename: ``,
      lastname: `${lastName}`,
      sex: 'male',
      isVerified: true,
    });
    await superAdminProfile.save();
  }

  console.log('SuperAdminProfile seeding complete');
  return;
};
