'use server';
import CourseFee from '@/models/CourseFee';

export const createCourseFee = async (data: any) => {
  try {
    const createDP = new CourseFee({ ...data });
    const created = await createDP.save();
    return created;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getCourseFeeByCourseId = async (courseId: string) => {
  try {
    const tFee = await CourseFee.findOne({ courseId }).populate('courseId').exec();
    return tFee;
  } catch (error) {
    console.log('service error', error);
    return null;
  }
};

export const getCourseFeeByCourseIdAndYear = async (year: string, courseId: string) => {
  try {
    const tFee = await CourseFee.findOne({ year, courseId }).populate('courseId').exec();
    return tFee;
  } catch (error) {
    console.log('service error', error);
    return null;
  }
};

export const getCourseFeeById = async (id: string) => {
  try {
    const tFee = await CourseFee.findById(id).populate('courseId').exec();
    return tFee;
  } catch (error) {
    console.log('service error', error);
    return null;
  }
};

export const updateCourseFeeById = async (id: string, data: any) => {
  try {
    const tFee = await CourseFee.findByIdAndUpdate(id, { ...data }, { new: true })
      .populate('courseId')
      .exec();
    return tFee;
  } catch (error) {
    console.log('service error', error);
    return null;
  }
};

export const getCourseFeeByCategory = async (category: string) => {
  try {
    const tFees = await CourseFee.find({ category }).populate('courseId').exec();
    return tFees;
  } catch (error) {
    console.log('service error', error);
    return [];
  }
};
