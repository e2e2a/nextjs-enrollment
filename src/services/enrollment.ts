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

export const getEnrollmentById = async (id: any) => {
  try {
    const e = await Enrollment.findById(id).populate('userId').populate('courseId').populate('profileId').exec();;
    // return JSON.parse(JSON.stringify(e));
    return e;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getEnrollmentByUserId = async (userId: string) => {
  try {
    const enrollment = await Enrollment.findOne({ userId }).populate('userId').populate('courseId').populate('profileId').exec();
    // console.log('i am exec...', enrollment);
    return JSON.parse(JSON.stringify(enrollment));
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getEnrollmentByStep = async (step: number) => {
  try {
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

export const updateEnrollmentById = async (id: any, data: any) => {
  try {
    // console.log('i am exec...', step);
    const e = await Enrollment.findByIdAndUpdate(id, { ...data }, { new: true });
    // console.log('i am exec...', enrollment);
    return e;
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
