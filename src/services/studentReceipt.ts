'use server';
import StudentReceipt from '@/models/StudentReceipt';

export const createStudentReceipt = async (data: any) => {
  try {
    const newP = new StudentReceipt({ ...data });
    const p = await newP.save();
    return p;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getStudentReceiptByStudentId = async (studentId: any) => {
  try {
    const sr = await StudentReceipt.find({ studentId }).populate('studentId').exec();
    return sr;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getStudentReceiptByCategory = async (category: any) => {
  try {
    const sr = await StudentReceipt.find({ category }).populate('studentId').exec();
    return sr;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getStudentReceiptById = async (id: any) => {
  try {
    const sr = await StudentReceipt.findById(id).populate('studentId').exec();
    return sr;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getStudentReceiptByStudentIdAndSchoolYear = async (studentId: any, schoolYear: string) => {
  try {
    const sr = await StudentReceipt.find({ studentId, schoolYear }).populate('studentId').exec();
    return sr;
  } catch (error) {
    console.log(error);
    return [];
  }
};
