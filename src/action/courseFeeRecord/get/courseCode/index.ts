'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getCourseFeeByCourseCodeAndYearAndSemester } from '@/services/courseFeeRecord';

/**
 * handles query Tuiton Fee Record by courseCode
 *
 * @param {string} courseCode
 */
export const getCourseFeeRecordByCourseCodeAndYearAndSemesterAction = async (year: string, semester: string, courseCode: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const tFee = await getCourseFeeByCourseCodeAndYearAndSemester(year, semester, courseCode);
 
    return { tFee: JSON.parse(JSON.stringify(tFee)), status: 200 };
  });
};
