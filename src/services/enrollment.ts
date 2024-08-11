'use server';
import Enrollment from '@/models/Enrollment';

export const createEnrollment = async (data: any) => {
  try {
    const newE = new Enrollment({
      ...data,
    });
    const e = await newE.save();
    return e;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getEnrollmentByUserId = async (userId: string) => {
  try {
    const enrollment = await Enrollment.findOne({ userId });
    console.log('i am exec...', enrollment);
    return enrollment;
  } catch (error) {
    console.log(error);
    return null;
  }
};
