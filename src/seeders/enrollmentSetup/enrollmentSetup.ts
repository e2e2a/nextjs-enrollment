'use server';
import EnrollmentSetup from '@/models/EnrollmentSetup';

export const seedEnrollmentSetup = async () => {
  await EnrollmentSetup.deleteMany({ name: 'GODOY' });
  console.log('Cleaned EnrollmentSetup complete');
  const es = new EnrollmentSetup({
    name: 'GODOY',
  });

  await es.save();
  console.log('EnrollmentSetup seeding complete');
  return;
};
