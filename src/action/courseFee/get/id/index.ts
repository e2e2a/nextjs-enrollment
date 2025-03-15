'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getCourseFeeById } from '@/services/courseFee';

/**
 * handles query Tuiton Fee by id
 *
 * @param {string} id
 */
export const getTuitionFeeByIdAction = async (id: string) => {
  return tryCatch(async () => {
    await dbConnect();

    const tFee = await getCourseFeeById(id);

    return { tFee: JSON.parse(JSON.stringify(tFee)), status: 200 };
  });
};
