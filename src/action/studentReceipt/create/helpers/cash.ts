'use server';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getEnrollmentByProfileId, updateEnrollmentById } from '@/services/enrollment';
import { getEnrollmentSetupByName } from '@/services/EnrollmentSetup';
import { createStudentReceipt, getStudentReceiptByStudentId } from '@/services/studentReceipt';
import { getStudentProfileById } from '@/services/studentProfile';

export const handleAccountingRole = async (user: any, data: any) => {
  return tryCatch(async () => {
    const studentProfile = await getStudentProfileById(data.studentId);

    if (!studentProfile) return { error: 'Your information false, Payment has been refunded.', status: 403 };

    const checkedDownPayment = await checkPaymentInDownPaymentExceed(user, studentProfile, data);
    if (!checkedDownPayment || checkedDownPayment.error) return { error: 'Your information false, Payment has been refunded.', status: 403 };

    return checkedDownPayment;
  });
};

const checkPaymentInDownPaymentExceed = async (user: any, student: any, data: any) => {
  return tryCatch(async () => {
    const studentEnrollment = await getEnrollmentByProfileId(student._id);
    if (!studentEnrollment) return { error: 'No Enrollment found', status: 404 };

    const captures = {
      amount: {
        currency_code: data?.amount?.currency_code,
        value: data?.amount?.value,
      },
    };

    const data2 = {
      year: studentEnrollment.studentYear,
      semester: studentEnrollment.studentSemester,
      ...data,
      captures: captures,
      payer: {
        name: { given_name: student?.firstname, surname: student?.lastname },
        email: student?.userId?.email,
        address: {
          admin_area_2: student?.numberStreet || student?.barangay,
          admin_area_1: student?.province,
          postal_code: '',
          country_code: 'PH',
        },
      },
      payment_source: 'CASH',
    };
    const createdReceipt = await createStudentReceipt(data2);
    if (!createdReceipt) return { error: 'Something went wrong.', status: 500 };

    const setup = await getEnrollmentSetupByName('GODOY');
    const a = await getStudentReceiptByStudentId(data.studentId);
    const b = await a.filter((rs) => rs.type.toLowerCase() === 'downpayment' && rs.schoolYear.toLowerCase() === setup.enrollmentTertiary.schoolYear.toLowerCase());
    if (studentEnrollment.step >= 5) {
      await updateEnrollmentById(studentEnrollment._id, { step: 6, payment: true });
    }
    return { success: true, message: 'Successful Payment, Receipt has been created.', userId: student.userId._id.toString(), category: data.category, status: 201 };
  });
};
