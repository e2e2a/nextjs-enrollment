'use server';
import { hashPassword } from '../../lib/helpers/hash/bcrypt';
import { User } from '../../models/User';
import { faker } from '@faker-js/faker';
import AccountingProfile from '@/models/AccountingProfile';

export const seedAccountingProfile = async () => {
  await User.deleteMany({ role: 'ACCOUNTING' });
  await AccountingProfile.deleteMany({});
  console.log('Cleaned AccountingProfile complete');

  const password = 'qweqwe';
  const p = await hashPassword(password);
  for (let i = 0; i < 10; i++) {
    const email = `accounting${i}@gmail.com`;
    const accounting = new User({
      email,
      username: `accounting${i}`,
      password: p,
      role: 'ACCOUNTING',
      emailVerified: '2000-09-19T16:00:00.000Z',
    });
    await accounting.save();

    // Generate a random firstname and lastname
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const accountingProfile = new AccountingProfile({
      userId: accounting._id,
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
    await accountingProfile.save();
  }

  console.log('AccountingProfile seeding complete');
  return;
};
