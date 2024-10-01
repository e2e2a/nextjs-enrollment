'use server';
import EnrollmentSetup from '@/models/EnrollmentSetup';

export const getEnrollmentSetupByName = async (name: string) => {
  try {
    const setup = await EnrollmentSetup.findOne({ name }).exec();
    return setup;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateEnrollmentSetupByName = async (name: string, data: any) => {
  try {
    const setup = await EnrollmentSetup.findOneAndUpdate({ name }, { ...data }, { new: true }).exec();
    return setup;
  } catch (error) {
    console.log(error);
    return null;
  }
};
