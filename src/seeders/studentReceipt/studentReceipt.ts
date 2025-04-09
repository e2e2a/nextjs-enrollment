'use server';
import { faker } from '@faker-js/faker';
import StudentReceipt from '@/models/StudentReceipt';
import { studentReceiptData } from './studentReceiptData';
import StudentProfile from '@/models/StudentProfile';

export const seedStudentReceipt = async () => {
  try {
    await StudentReceipt.deleteMany({});
    console.log('Cleaned StudentReceipt Collection');
    const studentReceiptDataWithNames = await Promise.all(
      studentReceiptData.map(async data => {
        const student = await StudentProfile.findById(data.studentId!);

        return {
          ...data,
          payer: {
            ...data.payer,
            name: {
              given_name: student?.firstname || faker.person.firstName(),
              surname: student?.lastname || faker.person.lastName(),
            },
            email: student?.email || 'example@gmail.com',
          },
        };
      })
    );

    await StudentReceipt.insertMany(studentReceiptDataWithNames);
    console.log('StudentReceipt seeding complete');
    return;
  } catch (err) {
    console.log('StudentReceipt', err);
  }
};
