'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getStudentReceiptById } from '@/services/studentPayment';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query student receipt by id
 *
 * @param {string} id
 */
export const getAllStudentReceiptByIdAction = async (id: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };

    const a = await checkRole(session.user, id);

    return a;
  });
};

const checkRole = (user: any, id: string) => {
  return tryCatch(async () => {
    const a = await getStudentReceiptById(id);
    if (!a) return { error: 'Not found', status: 404 };
    switch (user.role) {
      case 'ACCOUNTING':
        break;
      case 'STUDENT':
        const student = await getStudentProfileByUserId(user._id);
        if (student._id.toString() !== a.studentId._id.toString()) return { error: 'Forbidden', status: 403 };
        break;
      default:
        return { error: 'Not Authorized.', status: 403 };
    }
    return { success: true, studentReceipt: JSON.parse(JSON.stringify(a)), status: 200 };
  });
};
