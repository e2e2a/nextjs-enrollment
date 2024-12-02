'use server';
import DownPayment from '@/models/DownPayment';

export const createDownPayment = async (data: any) => {
  try {
    const createDP = new DownPayment({ ...data });
    const created = await createDP.save();
    return created;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getDownPaymentByCourseId = async (courseId: string) => {
  try {
    const courses = await DownPayment.find({ courseId }).populate('courseId').exec();
    return courses;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getDownPaymentByCategory = async (category: string) => {
  try {
    const courses = await DownPayment.find({ category }).populate('courseId').exec();
    return courses;
  } catch (error) {
    console.log(error);
    return [];
  }
};
