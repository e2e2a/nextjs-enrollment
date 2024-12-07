'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getTuitionFeeById } from '@/services/tuitionFee';

/**
 * handles query Tuiton Fee by id
 *
 * @param {string} id
 */
export const getTuitionFeeByIdAction = async (id: string) => {
  return tryCatch(async () => {
    await dbConnect();

    const tFee = await getTuitionFeeById(id);

    return { tFee: JSON.parse(JSON.stringify(tFee)), status: 200 };
  });
};
