'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getStudentReceiptByStudentId } from '@/services/studentPayment';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query student receipt by userId
 *
 * @param {string} userId
 */
export const getAllStudentReceiptByUserIdAction = async (userId: string, schoolYear?: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };
    if (session && session.user.role !== 'STUDENT') return { error: 'Forbidden', status: 403 };
    if (session.user._id !== userId) return { error: 'Forbidden', status: 403 };

    const student = await getStudentProfileByUserId(session.user._id);
    let studentReceipt;
    const a = await getStudentReceiptByStudentId(student._id);
    studentReceipt = a;
    if (schoolYear) studentReceipt = a.filter((sr) => sr.schoolYear.toLowerCase() === schoolYear.toLowerCase());

    return { studentReceipt: JSON.parse(JSON.stringify(studentReceipt)), status: 200 };
  });
};
