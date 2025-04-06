'use server';
import { hashPassword } from '../../lib/helpers/hash/bcrypt';
import AdminProfile from '../../models/AdminProfile';
import { User } from '../../models/User';
import { faker } from '@faker-js/faker';

export const seedAdminProfile = async () => {
  await User.deleteMany({ role: 'ADMIN' });
  await AdminProfile.deleteMany({});
  console.log('Cleaned AdminProfile complete');

  const password = 'qweqwe';
  const p = await hashPassword(password);
  for (let i = 0; i < 10; i++) {
    const email = `admin${i}@gmail.com`;
    const admin = new User({
      email,
      username: `admin${i}`,
      password: p,
      role: 'ADMIN',
      emailVerified: '2000-09-19T16:00:00.000Z',
    });
    await admin.save();

    // Generate a random firstname and lastname
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const adminProfile = new AdminProfile({
      userId: admin._id,
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
    await adminProfile.save();
  }
  console.log('AdminProfile seeding complete');
  return;
};
