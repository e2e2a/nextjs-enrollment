'use server';
import dbConnect from '@/lib/db/db';
import EnrollmentSetup from '@/models/EnrollmentSetup';
import { getEnrollmentSetupByName, updateEnrollmentSetupByName } from '@/services/EnrollmentSetup';

export const getEnrollmentSetup = async (): Promise<any> => {
  await dbConnect();
  try {
    const enrollmentSetup = await getEnrollmentSetupByName('GODOY');
    return { enrollmentSetup: JSON.parse(JSON.stringify(enrollmentSetup)), status: 200 };
  } catch (error) {
    console.log(error);
    return { error: 'Something went wrong.', status: 500 };
  }
};

export const updateEnrollmentSetup = async (data: any): Promise<any> => {
  await dbConnect();
  try {
    if (data.name !== 'GODOY') return { error: 'is not valid.', status: 500 };
    const enrollmentSetup = await updateEnrollmentSetupByName('GODOY', data);
    // if (data.enrollmentTertiary) {
    //   const enrollmentTertiary = await EnrollmentSetup.findOneAndUpdate({ name: 'GODOY' });
    //   enrollmentTertiary.enrollmentTertiary.open = data.enrollmentTertiary.open;
    //   if (data.enrollmentTertiary.schoolYear && data.enrollmentTertiary.semester) {
    //     enrollmentTertiary.enrollmentTertiary.schoolYear = data.enrollmentTertiary.schoolYear;
    //     enrollmentTertiary.enrollmentTertiary.semester = data.enrollmentTertiary.semester;
    //   }
    //   await enrollmentTertiary.save();
    // } else {
    //   const enrollmentSetup = await updateEnrollmentSetupByName('GODOY', data);
    // }
    return { message: 'Success', status: 201 };
  } catch (error) {
    console.log(error);
    return { error: 'Something went wrong.', status: 500 };
  }
};
