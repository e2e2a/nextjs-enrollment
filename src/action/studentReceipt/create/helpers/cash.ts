'use server';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getEnrollmentByProfileId, updateEnrollmentById } from '@/services/enrollment';
import { getEnrollmentSetupByName } from '@/services/EnrollmentSetup';
import { createStudentReceipt, getStudentReceiptByStudentId, getStudentReceiptByStudentIdAndSchoolYear } from '@/services/studentPayment';
import { getStudentProfileById } from '@/services/studentProfile';
import { getTuitionFeeByCourseId } from '@/services/tuitionFee';

export const handleAccountingRole = async (user: any, data: any) => {
  return tryCatch(async () => {
    const studentProfile = await getStudentProfileById(data.studentId);
    console.log('running here', data);
    if (!studentProfile) return { error: 'Your information false, Payment has been refunded.', status: 403 };

    const checkedDownPayment = await checkPaymentInDownPaymentExceed(user, studentProfile, data);
    if (!checkedDownPayment || checkedDownPayment.error) return { error: 'Your information false, Payment has been refunded.', status: 403 };
    console.log('checkedDownPayment', checkedDownPayment);
    return checkedDownPayment;
  });
};

const checkPaymentInDownPaymentExceed = async (user: any, student: any, data: any) => {
  return tryCatch(async () => {
    const studentEnrollment = await getEnrollmentByProfileId(student._id);
    if (!studentEnrollment) return { error: 'No Enrollment found', status: 404 };
    const fee = await getTuitionFeeByCourseId(studentEnrollment?.courseId?._id);

    const total = parseFloat(Number(fee.downPayment).toFixed(2));
    // const d = await checkSellerProtectionStatus(data.orderID);
    // if (!d) return { error: 'Sorry we cant find your Payment', message: 'yesyes', status: 200 };
    // const seller_protection = d.res.purchase_units[0].payments.captures[0].seller_protection.status;

    // console.log('capture: ', capture);
    const captures = {
      amount: {
        currency_code: data?.amount?.currency_code,
        value: data?.amount?.value,
      },
    };

    // data.payer.address = d.res.purchase_units[0].shipping.address;
    // data.payer.captures = captures;
    const data2 = {
      ...data,
      captures: captures,
      payer: {
        name: { given_name: student?.firstname, surname: student?.lastname }, // Payer name (given_name, surname)
        email: student?.userId?.email, // Payer email
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
