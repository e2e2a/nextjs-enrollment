'use server';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { createStudentReceipt } from '@/services/studentReceipt';

export const handleAccountingRole = async (user: any, data: any, studentProfile: any, studentEnrollment: any) => {
  return tryCatch(async () => {
    const checkedDownPayment = await checkPaymentInDownPaymentExceed(user, studentProfile, data, studentEnrollment);
    if (!checkedDownPayment || checkedDownPayment.error) return { error: 'Your information false, Payment has been refunded.', status: 403 };

    return checkedDownPayment;
  });
};

const checkPaymentInDownPaymentExceed = async (user: any, student: any, data: any, studentEnrollment: any) => {
  return tryCatch(async () => {
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
      isPaidByScholarship: data.isPaidByScholarship,
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

    return { success: true, message: 'Successful Payment, Receipt has been created.', userId: student?.userId?._id.toString(), category: data.category, status: 201 };
  });
};
