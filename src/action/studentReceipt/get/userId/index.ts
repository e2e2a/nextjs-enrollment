'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getStudentReceiptByStudentId } from '@/services/studentReceipt';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query student receipt by userId
 *
 * @param {string} userId
 */
export const getAllStudentReceiptByUserIdAction = async (userId: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };
    if (session && session.user.role !== 'STUDENT' && session.user.role !== 'ACCOUNTING') return { error: 'Forbidden', status: 403 };
    if (session.user.role === 'STUDENT' && session.user._id !== userId) return { error: 'Forbidden', status: 403 };

    const student = await getStudentProfileByUserId(userId);
    let studentReceipt;
    const a = await getStudentReceiptByStudentId(student._id);
    studentReceipt = a;

    return { studentReceipt: JSON.parse(JSON.stringify(studentReceipt)), status: 200 };
  });
};
