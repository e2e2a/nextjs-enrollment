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
    if (data.previousBalance && data.previousBalance.length > 0 && data?.type?.toLowerCase() !== 'downpayment' && data?.type?.toLowerCase() !== 'ssg' && data?.type?.toLowerCase() !== 'departmental' && data?.type?.toLowerCase() !== 'insurance') {
      // await checkBalance(studentEnrollment.studentYear, studentEnrollment.studentSemester, student._id.toString(), studentReceipt);
      let amountPaid = 0;
      if (data.perTermPaymentCurrent > 0) amountPaid = data.taxes.amount - data.perTermPaymentCurrent;
      console.log('perTermPaymentCurrent', data.perTermPaymentCurrent);
      console.log('amountPaid', amountPaid);
      for (const prev of data.previousBalance) {
        if (Number(amountPaid) > 0) {
          let type = '';
          let amount;
          if (prev.finalBalance > 0) {
            type = 'final';
            amount = prev.finalBalance;
          }
          if (prev.semiFinalBalance > 0) {
            type = 'semi-final';
            amount = prev.semiFinalBalance;
          }
          if (prev.midtermBalance > 0) {
            type = 'midterm';
            amount = prev.midtermBalance;
          }
          if (prev.prelimBalance > 0) {
            type = 'prelim';
            amount = prev.prelimBalance;
          }
          const captures = {
            id: '',
            amount: {
              currency_code: data?.amount?.currency_code,
              value: data?.amount?.value,
            },
            taxes: {
              fee: '',
              fixed: '',
              amount: amountPaid > amount ? Number(amount || 0) : Number(amountPaid || 0),
            },
            isPaidIn: {
              year: studentEnrollment.studentYear,
              semester: studentEnrollment.studentSemester,
            },
            type: type,
          };
          const createdReceipt = await createStudentReceipt({ ...data2, ...captures, year: prev.year, semester: prev.semester });
          if (!createdReceipt) return { error: 'Something went wrong.', status: 500 };
          amountPaid = Number(amountPaid - amount);
        }
      }
    }
    const createdReceipt = await createStudentReceipt(data2);
    if (!createdReceipt) return { error: 'Something went wrong.', status: 500 };

    return { success: true, message: 'Successful Payment, Receipt has been created.', userId: student?.userId?._id.toString(), category: data.category, status: 201 };
  });
};
