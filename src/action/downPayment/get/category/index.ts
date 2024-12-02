'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getDownPaymentByCategory } from '@/services/downPayment';

/**
 * handles query Down Payment by category
 *
 * @param {string} category
 */
export const getAllDownPaymentByCategory = async (category: string) => {
  return tryCatch(async () => {
    await dbConnect();

    const downPayments = await getDownPaymentByCategory(category);

    return { downPayments: JSON.parse(JSON.stringify(downPayments)), status: 200 };
  });
};
