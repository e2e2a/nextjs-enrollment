'use server';
import CourseFeeRecord from '@/models/CourseFeeRecord';

export const getCourseFeeByCourseCodeAndYearAndSemester = async (year: string, semester: string, courseCode: string) => {
  try {
    const tFee = await CourseFeeRecord.findOne({ year, semester, courseCode }).exec();
    return tFee;
  } catch (error) {
    console.log('service error', error);
    return null;
  }
};

export const getCourseFeeRecordByCourseCode = async (courseCode: string) => {
  try {
    const tFee = await CourseFeeRecord.findOne({ courseCode }).exec();
    return tFee;
  } catch (error) {
    console.log('service error', error);
    return null;
  }
};

export const getCourseFeeRecordByCourse = async (course: string) => {
  try {
    const tFee = await CourseFeeRecord.findOne({ course }).exec();
    return tFee;
  } catch (error) {
    console.log('service error', error);
    return null;
  }
};
