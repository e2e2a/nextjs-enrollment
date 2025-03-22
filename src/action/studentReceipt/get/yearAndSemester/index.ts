'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getStudentReceiptByStudentId } from '@/services/studentReceipt';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import { checkAuth } from '@/utils/actions/session';
import { getCourseFeeByCourseId } from '@/services/courseFee';

/**
 * handles query student receipt by userId
 *
 * @param {string} userId
 */
export const getAllStudentReceiptByUserIdAndYearAndSemesterAction = async (userId: string, year: string, semester: string, schoolYear: string) => {
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
    if (!year && !semester && !schoolYear) return { error: 'Invalid inputs', status: 400 };
    const c = await checkPaymentOfInsurance(studentReceipt, year, schoolYear);
    // this is the insurance space for searching the insurance by semester and year
    studentReceipt = a.filter((sr) => sr.year.toLowerCase() === year.toLowerCase() && sr.semester.toLowerCase() === semester.toLowerCase() && sr.schoolYear.toLowerCase() === schoolYear.toLowerCase());

    return { studentReceipt: JSON.parse(JSON.stringify(studentReceipt)), ...c, status: 200 };
  });
};

const checkPaymentOfInsurance = async (studentReceipt: any, year: string, schoolYear: string) => {
  return tryCatch(async () => {
    const a = studentReceipt.filter((sr: any) => sr?.year.toLowerCase() === year.toLowerCase() && sr?.schoolYear.toLowerCase() === schoolYear.toLowerCase());
    let insurancePayment = false;
    const insurancePayment1 = a
      ?.filter((r: any) => r.type.toLowerCase() === 'insurance')
      ?.reduce((total: number, payment: any) => {
        return { amount: total + (Number(payment?.taxes?.amount) || 0), semester: payment.semester, schoolYear: payment.schoolYear };
      }, 0);
    if (insurancePayment1) insurancePayment = true;
    return { insurancePayment, insurancePaymentSemester: insurancePayment1.semester };
  });
};
