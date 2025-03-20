'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getEnrollmentByProfileId, updateEnrollmentById } from '@/services/enrollment';
import { getEnrollmentSetupByName } from '@/services/EnrollmentSetup';
import { createStudentReceipt, getStudentReceiptByStudentId } from '@/services/studentReceipt';
import { getStudentProfileById } from '@/services/studentProfile';
import { checkAuth } from '@/utils/actions/session';
import { v4 as uuidv4 } from 'uuid';
import { ApiError, Client, Environment, LogLevel, OrdersController } from '@paypal/paypal-server-sdk';
import { handleAccountingRole } from './helpers/cash';
import { getEnrollmentRecordById } from '@/services/enrollmentRecord';
import { getCourseFeeByCourseId } from '@/services/courseFee';
import { getCourseByCourseCode } from '@/services/course';

/**
 * any authenticated user
 * handle create student receipt
 *
 * @param {object} data
 */
export const createStudentReceiptAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };

    const setup = await getEnrollmentSetupByName('GODOY');
    if (!setup || !setup.enrollmentTertiary || !setup.enrollmentTertiary.schoolYear) return { error: 'Enrollment has not started yet.', status: 400 };
    data.schoolYear = setup.enrollmentTertiary.schoolYear;

    const a = await checkRole(session.user, data, setup);
    return a;
  });
};

const checkRole = async (user: any, data: any, setup: any) => {
  return tryCatch(async () => {
    let b;
    const studentProfile = await getStudentProfileById(data.studentId);
    if (!studentProfile) {
      // await refundPayment(data.captureId, data.amount);
      return { error: 'Your information false, Payment has been refunded.', status: 403 };
    }
    let studentEnrollment;
    studentEnrollment = await getEnrollmentByProfileId(studentProfile?._id);
    if (data.request === 'record') studentEnrollment = await getEnrollmentRecordById(data.enrollmentId);
    if (!studentEnrollment) return { error: 'No Enrollment found', status: 404 };
    let cFee = null;
    const course = await getCourseByCourseCode(studentEnrollment.courseCode);
    cFee = await getCourseFeeByCourseId(studentEnrollment?.courseId?._id);
    if (data.request === 'record') cFee = await getCourseFeeByCourseId(course?._id);
    if (!cFee) return { error: 'Course fee not found.', status: 404 };
    const checkedType = await checkTypeOfPayment(data, cFee);
    if (!checkedType || checkedType.error) return checkedType;
    switch (user.role) {
      case 'STUDENT':
        b = await handleStudentRole(user, data, studentProfile, studentEnrollment);
        break;
      case 'ACCOUNTING':
        b = await handleAccountingRole(user, data, studentProfile, studentEnrollment);
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    if (!b || b.error) return b;

    let studentReceipt;
    const a = await getStudentReceiptByStudentId(studentProfile._id);
    studentReceipt = a;
    const ssgPayment = await checkPaymentOfSSG(studentReceipt);
    if (!studentEnrollment.studentYear && !studentEnrollment.studentSemester && !studentEnrollment.schoolYear) return { error: 'Invalid inputs', status: 400 };
    const insurancePayment = await checkPaymentOfInsurance(studentReceipt, studentEnrollment.studentYear, studentEnrollment.schoolYear);

    // this is the insurance space for searching the insurance by semester and year
    studentReceipt = a.filter(
      (sr) => sr.year.toLowerCase() === studentEnrollment.studentYear.toLowerCase() && sr.semester.toLowerCase() === studentEnrollment.studentSemester.toLowerCase() && sr.schoolYear.toLowerCase() === studentEnrollment.schoolYear.toLowerCase()
    );

    // Departmental Payment
    const paymentOfDownPayment = studentReceipt
      ?.filter((r: any) => r.type.toLowerCase() === 'downpayment')
      ?.reduce((total: number, payment: any) => {
        return total + (Number(payment?.taxes?.amount) || 0);
      }, 0);
    const downPayment = Number(paymentOfDownPayment) - Number(cFee?.downPayment || 0);
    const pymentOfDownPaymentExceed = paymentOfDownPayment && downPayment >= 0;

    // Departmental Payment
    const paymentOfDepartmental = studentReceipt
      ?.filter((r: any) => r.type.toLowerCase() === 'departmental')
      ?.reduce((total: number, payment: any) => {
        return total + (Number(payment?.taxes?.amount) || 0);
      }, 0);
    const departmentalPayment = Number(paymentOfDepartmental) - Number(cFee?.departmentalFee || 0);
    const paymentOfDepartmentalExceed = paymentOfDepartmental && departmentalPayment >= 0;

    // Insurance Payment
    // const paymentOfInsurance = studentReceipt
    //   ?.filter((r: any) => r.type.toLowerCase() === 'insurance')
    //   ?.reduce((total: number, payment: any) => {
    //     return total + (Number(payment?.taxes?.amount) || 0);
    //   }, 0);
    // const insurancePayment = Number(paymentOfInsurance) - Number(cFee?.insurance || 0);
    // const showPaymentOfInsurance = paymentOfInsurance && insurancePayment >= 0;

    // SSG Payment
    const paymentOfSSG = studentReceipt
      ?.filter((r: any) => r.type.toLowerCase() === 'ssg')
      ?.reduce((total: number, payment: any) => {
        return total + (Number(payment?.taxes?.amount) || 0);
      }, 0);
    const ssgPaymentCheck = Number(paymentOfSSG) - Number(cFee?.ssgFee || 0);
    const showPaymentOfSSG = ssgPayment.ssgPayment || (paymentOfSSG && ssgPaymentCheck >= 0);

    const updateData = { payment: true, step: 6 };

    // const asd = await studentReceipt.filter((rs) => rs.type.toLowerCase() === 'downpayment' && rs.schoolYear.toLowerCase() === setup.enrollmentTertiary.schoolYear.toLowerCase());
    if (studentEnrollment.step === 5 && showPaymentOfSSG && insurancePayment.insurancePayment && pymentOfDownPaymentExceed && paymentOfDepartmentalExceed) await updateEnrollmentById(studentEnrollment._id, updateData);

    return b;
  });
};

const checkTypeOfPayment = async (data: any, cFee: any) => {
  return tryCatch(async () => {
    const type = data.type.toLowerCase();
    let payment = false;

    switch (type) {
      case 'downpayment':
        payment = Number(data.taxes.amount) === Number(cFee.downPayment);
        break;
      case 'ssg':
        payment = Number(data.taxes.amount) === Number(cFee.ssgFee);
        break;
      case 'departmental':
        payment = Number(data.taxes.amount) === Number(cFee.departmentalFee);
        break;
      case 'insurance':
        payment = Number(data.taxes.amount) === Number(cFee.insuranceFee);
        break;
      // case 'fullpayment':
      //   break;
      default:
        payment = true;
        break;
    }
    if (!payment) return { error: 'Amount of payment should be equal to amount to pay.', status: 400 };
    return { success: true, message: 'Payment type is valid.', status: 200 };
  });
};

const handleStudentRole = async (user: any, data: any, studentProfile: any, studentEnrollment: any) => {
  return tryCatch(async () => {
    const checkedDownPayment = await checkPaymentInDownPaymentExceed(user, studentProfile, data, studentEnrollment);
    if (!checkedDownPayment || checkedDownPayment.error) {
      // await refundPayment(data.captureId, data.amount);
      return { error: 'Your information false, Payment has been refunded.', status: 403 };
    }

    return { success: true, message: 'Successful Payment, Receipt has been created.', userId: user._id.toString(), status: 201 };
  });
};

const checkPaymentInDownPaymentExceed = async (user: any, student: any, data: any, studentEnrollment: any) => {
  return tryCatch(async () => {
    const d = await checkSellerProtectionStatus(data.orderID);
    if (!d) return { error: 'Sorry we cant find your Payment', message: 'yesyes', status: 200 };
    const seller_protection = d.res.purchase_units[0].payments.captures[0].seller_protection.status;

    const capture = d.res.purchase_units[0].payments.captures[0];
    // console.log('capture: ', capture);
    const captures = {
      id: capture.id,
      status: capture.status,
      amount: {
        currency_code: capture.amount.currency_code,
        value: capture.amount.value,
      },
      final_capture: capture.final_capture,
      seller_protection: {
        status: capture.seller_protection.status,
        dispute_categories: capture.seller_protection.dispute_categories,
      },
      create_time: new Date(capture.create_time),
      update_time: new Date(capture.update_time),
    };

    const payment_source = {
      ...(d.res.payment_source.card && { card: d?.res?.payment_source?.card }),
      ...(d.res.payment_source.paypal && { paypal: d?.res?.payment_source?.paypal }),
    };
    // data.payer.address = d.res.purchase_units[0].shipping.address;
    // data.payer.captures = captures;
    const data2 = { ...data, captures: captures, year: studentEnrollment.studentYear, semester: studentEnrollment.studentSemester, 'payer.address': d?.res?.purchase_units[0].shipping?.address, payment_source: payment_source };
    const createdReceipt = await createStudentReceipt(data2);
    if (!createdReceipt) return { error: 'Something went wrong.', status: 500 };

    const setup = await getEnrollmentSetupByName('GODOY');

    return { success: true, message: 'Successful Payment, Receipt has been created.', status: 201 };
  });
};

async function getAccessToken() {
  const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')}`, // Correct OAuth header
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  if (data.error) {
    console.error('Error getting PayPal token:', data.error_description);
    throw new Error(data.error_description);
  }

  return data.access_token;
}

async function refundPayment(captureId: string, amount: any) {
  const accessToken = await getAccessToken(); // Get the access token
  const uniqueRequestId = uuidv4();
  const response = await fetch(`https://api-m.sandbox.paypal.com/v2/payments/captures/${captureId}/refund`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'PayPal-Request-Id': uniqueRequestId, // Optional, unique request ID
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      amount: {
        value: amount.value.toFixed(2),
        currency_code: amount.currency_code,
      },
      invoice_id: 'INVOICE-123', // Optional invoice ID for tracking
      note_to_payer: 'DefectiveProduct', // Optional note to payer
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    console.log('Refund failed. Status code:', response.status);
    console.log('Error details:', errorDetails);
    return { success: false, status: response.status, error: errorDetails };
  }

  const refundDetails = await response.json();
  console.log('Refund Successful:', refundDetails);
  return { success: true, status: 201, refundDetails };
}

async function checkSellerProtectionStatus(orderID: string) {
  const accessToken = await getAccessToken(); // Get the access token
  const uniqueRequestId = uuidv4();
  const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      // 'PayPal-Request-Id': uniqueRequestId, // Optional, unique request ID
      // Prefer: 'return=representation',
    },
  });
  //   fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders/5O190127TN364715T', {
  //     headers: {
  //         'Authorization': 'Bearer access_token6V7rbVwmlM1gFZKW_8QtzWXqpcwQ6T5vhEGYNJDAAdn3paCgRpdeMdVYmWzgbKSsECednupJ3Zx5Xd-g'
  //     }
  // });
  if (!response.ok) {
    const errorDetails = await response.json();
    console.log(' failed. Status code:', response.status);
    console.log('Error details1:', errorDetails);
    return { success: false, status: response.status, error: errorDetails };
  }

  const res = await response.json();
  // console.log(' Successful:', res);
  return { success: true, status: 201, res };
}

const checkPaymentOfSSG = async (studentReceipt: any) => {
  return tryCatch(async () => {
    let ssgPayment = false;
    const ssgPayment1 = studentReceipt?.filter((r: any) => r.type.toLowerCase() === 'ssg');

    if (ssgPayment1.length >= 2) ssgPayment = true;
    return { ssgPayment };
  });
};

const checkPaymentOfInsurance = async (studentReceipt: any, year: string, schoolYear: string) => {
  return tryCatch(async () => {
    const a = studentReceipt.filter((sr: any) => sr?.year.toLowerCase() === year.toLowerCase() && sr?.schoolYear.toLowerCase() === schoolYear.toLowerCase());
    let insurancePayment = false;
    const insurancePayment1 = a
      ?.filter((r: any) => r.type.toLowerCase() === 'insurance')
      ?.reduce((total: number, payment: any) => {
        return { amount: total + (Number(payment?.taxes?.amount) || 0), schoolYear: payment.schoolYear };
      }, 0);
    if (insurancePayment1) insurancePayment = true;
    return { insurancePayment };
  });
};
