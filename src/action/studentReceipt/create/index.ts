'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getEnrollmentByProfileId, updateEnrollmentById } from '@/services/enrollment';
import { getEnrollmentSetupByName } from '@/services/EnrollmentSetup';
import { createStudentReceipt, getStudentReceiptByStudentId } from '@/services/studentPayment';
import { getStudentProfileById } from '@/services/studentProfile';
import { getTuitionFeeByCourseId } from '@/services/tuitionFee';
import { checkAuth } from '@/utils/actions/session';
import { v4 as uuidv4 } from 'uuid';
import { ApiError, Client, Environment, LogLevel, OrdersController } from '@paypal/paypal-server-sdk';
import { handleAccountingRole } from './helpers/cash';

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

    const a = await checkRole(session.user, data);
    return a;
  });
};

const checkRole = async (user: any, data: any) => {
  return tryCatch(async () => {
    let b;
    switch (user.role) {
      case 'STUDENT':
        b = await handleStudentRole(user, data);
        break;
      case 'ACCOUNTING':
        b = await handleAccountingRole(user, data);
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    return b;
  });
};

const handleStudentRole = async (user: any, data: any) => {
  return tryCatch(async () => {
    const studentProfile = await getStudentProfileById(data.studentId);
    if (!studentProfile) {
      // await refundPayment(data.captureId, data.amount);
      return { error: 'Your information false, Payment has been refunded.', status: 403 };
    }
    const checkedDownPayment = await checkPaymentInDownPaymentExceed(user, studentProfile, data);
    if (!checkedDownPayment || checkedDownPayment.error) {
      // await refundPayment(data.captureId, data.amount);
      return { error: 'Your information false, Payment has been refunded.', status: 403 };
    }

    return { success: true, message: 'Successful Payment, Receipt has been created.', userId: user._id.toString(), status: 201 };
  });
};

const checkPaymentInDownPaymentExceed = async (user: any, student: any, data: any) => {
  return tryCatch(async () => {
    const studentEnrollment = await getEnrollmentByProfileId(student._id);
    if (!studentEnrollment) return { error: 'No Enrollment found', status: 404 };
    const fee = await getTuitionFeeByCourseId(studentEnrollment.courseId._id);

    const total = parseFloat(Number(fee.downPayment).toFixed(2));
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
    const data2 = { ...data, captures: captures, 'payer.address': d?.res?.purchase_units[0].shipping?.address, payment_source: payment_source };
    const createdReceipt = await createStudentReceipt(data2);
    if (!createdReceipt) return { error: 'Something went wrong.', status: 500 };

    const setup = await getEnrollmentSetupByName('GODOY');
    const a = await getStudentReceiptByStudentId(data.studentId);
    const b = await a.filter((rs) => rs.type.toLowerCase() === 'downpayment' && rs.schoolYear.toLowerCase() === setup.enrollmentTertiary.schoolYear.toLowerCase());

    let recentPayment = 0;
    if (b && b.length > 0) {
      for (const rs of a) {
        recentPayment += parseFloat(Number(rs.amount.value || 0).toFixed(2));
      }

      // if(studentEnrollment.step === 5) return { error: 'Your step is not valid.', status: 403 };
      if (d.res.purchase_units[0].payments.captures[0].status === 'COMPLETED') {
        await updateEnrollmentById(studentEnrollment._id, { step: 6, payment: true });
      }
    }
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
    throw new Error(data.error_description); // Handle error appropriately
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
  console.log('captureId:', orderID);
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
