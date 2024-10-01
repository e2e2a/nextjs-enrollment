'use server';
import dbConnect from '@/lib/db/db';
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
    const enrollmentSetup = await updateEnrollmentSetupByName('GODOY', data);
    return { enrollmentSetup: JSON.parse(JSON.stringify(enrollmentSetup)), status: 200 };
  } catch (error) {
    console.log(error);
    return { error: 'Something went wrong.', status: 500 };
  }
};
