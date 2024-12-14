'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getTuitionFeeByCourseId } from '@/services/tuitionFee';

/**
 * handles query Tuiton Fee by courseId
 *
 * @param {string} courseId
 */
export const getAllTuitionFeeByCourseIdAction = async (courseId: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const tFee = await getTuitionFeeByCourseId(courseId);

    return { tFee: JSON.parse(JSON.stringify(tFee)), status: 200 };
  });
};
