'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getCourseFeeByCourseIdAndYear } from '@/services/courseFee';

/**
 * handles query Tuiton Fee by courseId
 *
 * @param {string} courseId
 */
export const getCourseFeeByCourseIdAndYearAction = async (year: string, courseId: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const tFee = await getCourseFeeByCourseIdAndYear(year, courseId);

    return { tFee: JSON.parse(JSON.stringify(tFee)), status: 200 };
  });
};
