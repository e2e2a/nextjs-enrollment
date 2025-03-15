'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getCourseFeeByCategory } from '@/services/courseFee';

/**
 * handles query Tuiton Fee by category
 *
 * @param {string} category
 */
export const getAllTuitionFeeByCategoryAction = async (category: string) => {
  return tryCatch(async () => {
    await dbConnect();

    const tFees = await getCourseFeeByCategory(category);

    return { tFees: JSON.parse(JSON.stringify(tFees)), status: 200 };
  });
};
