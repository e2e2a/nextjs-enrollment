'use server';
import Enrollment from '@/models/Enrollment';

export const createEnrollment = async (data: any) => {
  try {
    console.log('serverdata', data);
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

export const getEnrollmentById = async (id: any) => {
  try {
    /**
     * @todo
     * populate userId, courseId and the ProfileId in the user fields
     */
    const e = await Enrollment.findById(id).populate('userId').populate('courseId').populate('profileId');
    // return JSON.parse(JSON.stringify(e));
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
    return JSON.parse(JSON.stringify(enrollment));
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getEnrollmentByStep = async (step: number) => {
  try {
    // console.log('i am exec...', step);
    const enrollment = await Enrollment.find({ step })
      .populate('userId') // Populate the `userId` reference
      .populate('courseId') // Populate the `courseId` reference
      .populate('profileId')
      .exec();
    // console.log('i am exec...', enrollment);
    return JSON.parse(JSON.stringify(enrollment));
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteEnrollmentById = async (id: any) => {
  try {
    const e = await Enrollment.findByIdAndDelete(id);
    if (!e) return false;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
