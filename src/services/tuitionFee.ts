'use server';
import TuitionFee from '@/models/TuitionFee';

export const createTuitionFee = async (data: any) => {
  try {
    const createDP = new TuitionFee({ ...data });
    const created = await createDP.save();
    return created;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getTuitionFeeByCourseId = async (courseId: string) => {
  try {
    const tFee = await TuitionFee.findOne({ courseId }).populate('courseId').exec();
    return tFee;
  } catch (error) {
    console.log('service error', error);
    return null;
  }
};

export const getTuitionFeeById = async (id: string) => {
  try {
    const tFee = await TuitionFee.findById(id).populate('courseId').exec();
    return tFee;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateTuitionFeeById = async (id: string, data: any) => {
  try {
    const tFee = await TuitionFee.findByIdAndUpdate(id, { ...data }, { new: true })
      .populate('courseId')
      .exec();
    return tFee;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getTuitionFeeByCategory = async (category: string) => {
  try {
    const tFees = await TuitionFee.find({ category }).populate('courseId').exec();
    return tFees;
  } catch (error) {
    console.log(error);
    return [];
  }
};
