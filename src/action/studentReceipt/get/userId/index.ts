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
export const getAllStudentReceiptByUserIdAction = async (userId: string, schoolYear?: string) => {
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
    if (schoolYear) studentReceipt = a.filter((sr) => sr.schoolYear.toLowerCase() === schoolYear.toLowerCase());

    const b = await checkPaymentOfRequired(studentReceipt);

    return { studentReceipt: JSON.parse(JSON.stringify(studentReceipt)), ...b, status: 200 };
  });
};

const checkPaymentOfRequired = async (studentReceipt: any) => {
  return tryCatch(async () => {
    let departmentalPayment = false;
    let ssgPayment = false;
    const departmentalPayment1 = studentReceipt
      ?.filter((r: any) => r.type.toLowerCase() === 'departmental')
      ?.reduce((total: number, payment: any) => {
        return { amount: total + (Number(payment?.taxes?.amount) || 0), schoolYear: payment.schoolYear };
      }, 0);
    const departmentalPayment2 = studentReceipt
      ?.filter((r: any) => r.type.toLowerCase() === 'departmental' && r.schoolYear !== departmentalPayment1?.schoolYear)
      ?.reduce((total: number, payment: any) => {
        return { amount: total + (Number(payment?.taxes?.amount) || 0), schoolYear: payment.schoolYear };
      }, 0);

    const ssgPayment1 = studentReceipt
      ?.filter((r: any) => r.type.toLowerCase() === 'ssg')
      ?.reduce((total: number, payment: any) => {
        return { amount: total + (Number(payment?.taxes?.amount) || 0), schoolYear: payment.schoolYear };
      }, 0);
    const ssgPayment2 = studentReceipt
      ?.filter((r: any) => r.type.toLowerCase() === 'ssg')
      ?.reduce((total: number, payment: any) => {
        return { amount: total + (Number(payment?.taxes?.amount) || 0), schoolYear: payment.schoolYear };
      }, 0);
    if (departmentalPayment1 && departmentalPayment2) departmentalPayment = true;
    if (ssgPayment1 && ssgPayment2) ssgPayment = true;
    return { departmentalPayment, ssgPayment };
  });
};
