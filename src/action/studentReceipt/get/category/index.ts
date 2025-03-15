'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getStudentReceiptByCategory } from '@/services/studentReceipt';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query student receipt by category
 *
 * @param {string} category
 */
export const getAllStudentReceiptByCategoryAction = async (category: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };
    if (session && session.user.role !== 'ACCOUNTING') return { error: 'Forbidden', status: 403 };

    const a = await checkCategory(category);

    return a;
  });
};

const checkCategory = async (category: string) => {
  return tryCatch(async () => {
    let studentReceipt;
    switch (category) {
      case 'College':
        studentReceipt = await getStudentReceiptByCategory(category);
        break;
      default:
        return { error: 'Invalid category.', status: 400 };
    }

    if (!studentReceipt) return { error: 'Not Found', status: 404 };
    return { studentReceipt: JSON.parse(JSON.stringify(studentReceipt)), success: true, status: 200 };
  });
};
