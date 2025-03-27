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
import { getEnrollmentRecordById, getEnrollmentRecordByProfileId } from '@/services/enrollmentRecord';
import { getCourseFeeByCourseId } from '@/services/courseFee';
import { getCourseByCourseCode } from '@/services/course';
import { getCourseFeeByCourseCodeAndYearAndSemester, getCourseFeeRecordByCourse, getCourseFeeRecordByCourseCode } from '@/services/courseFeeRecord';
import { studentSemesterData, studentYearData } from '@/constant/enrollment';

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
    if (data.request === 'record') {
      cFee = await getCourseFeeByCourseCodeAndYearAndSemester(studentEnrollment.studentYear, studentEnrollment.studentSemester, course?.courseCode);
    }
    if (!cFee) return { error: 'Course fee not found.', status: 404 };
    const checkedType = await checkTypeOfPayment(user, data, cFee);
    if (!checkedType || checkedType.error) return checkedType;
    let studentReceipt;
    const a = await getStudentReceiptByStudentId(studentProfile._id);
    studentReceipt = a;
    switch (user.role) {
      case 'STUDENT':
        b = await handleStudentRole(user, data, studentProfile, studentEnrollment, studentReceipt);
        break;
      case 'ACCOUNTING':
        b = await handleAccountingRole(user, data, studentProfile, studentEnrollment);
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    if (!b || b.error) return b;

    if (!studentEnrollment.studentYear && !studentEnrollment.studentSemester && !studentEnrollment.schoolYear) return { error: 'Invalid inputs', status: 400 };
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
    const downPayment = Number(paymentOfDownPayment) >= 500;

    const updateData = { payment: true, step: 6 };
    if (studentEnrollment.step === 5 && downPayment) await updateEnrollmentById(studentEnrollment._id, updateData);

    return b;
  });
};

const checkTypeOfPayment = async (user: any, data: any, cFee: any) => {
  return tryCatch(async () => {
    const type = data.type.toLowerCase();
    let payment = false;

    switch (type) {
      case 'downpayment':
        if (user.role === 'STUDENT') {
          payment = Number(data.taxes.amount) >= Number(cFee.downPayment);
          if (!payment) return { error: `Amount of down payment should greater than ${cFee.downPayment}.`, status: 400 };
        }
        if (user.role === 'ACCOUNTING') {
          payment = Number(data.taxes.amount) >= 500;
          if (!payment) return { error: 'Amount of down payment should greater than 500.', status: 400 };
        }
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
      case 'passbook':
        payment = Number(data.taxes.amount) === Number(cFee.passbookFee);
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

const handleStudentRole = async (user: any, data: any, studentProfile: any, studentEnrollment: any, studentReceipt: any) => {
  return tryCatch(async () => {
    const checkedDownPayment = await checkAndCreateStudentReceipt(user, studentProfile, data, studentEnrollment, studentReceipt);
    if (!checkedDownPayment || checkedDownPayment.error) {
      // await refundPayment(data.captureId, data.amount);
      return { error: 'Your information false, Payment has been refunded.', status: 403 };
    }

    return { success: true, message: 'Successful Payment, Receipt has been created.', userId: user._id.toString(), status: 201 };
  });
};

const checkAndCreateStudentReceipt = async (user: any, student: any, data: any, studentEnrollment: any, studentReceipt: any) => {
  return tryCatch(async () => {
    const d = await checkSellerProtectionStatus(data.orderID);
    if (!d) return { error: 'Sorry we cant find your Payment', message: 'yesyes', status: 200 };
    const seller_protection = d.res.purchase_units[0].payments.captures[0].seller_protection.status;

    const capture = d.res.purchase_units[0].payments.captures[0];
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
    if (
      data.previousBalance &&
      data.previousBalance.length > 0 &&
      data?.type?.toLowerCase() !== 'downpayment' &&
      data?.type?.toLowerCase() !== 'ssg' &&
      data?.type?.toLowerCase() !== 'passbook' &&
      data?.type?.toLowerCase() !== 'departmental' &&
      data?.type?.toLowerCase() !== 'insurance'
    ) {
      // await checkBalance(studentEnrollment.studentYear, studentEnrollment.studentSemester, student._id.toString(), studentReceipt);
      let amountPaid = data.taxes.amount;
      if (data.perTermPaymentCurrent > 0) amountPaid = data.taxes.amount - data.perTermPaymentCurrent;
      for (const prev of data.previousBalance) {
        if (Number(amountPaid) > 0) {
          let type;
          let amount;
          const captures = {
            id: '',
            category: 'College',
            status: capture.status,
            studentId: studentEnrollment.profileId?._id,
            amount: {
              currency_code: capture.amount.currency_code,
              value: capture.amount.value,
            },
            final_capture: capture.final_capture,
            seller_protection: {
              status: capture.seller_protection.status,
              dispute_categories: capture.seller_protection.dispute_categories,
            },
            isPaidIn: {
              year: studentEnrollment.studentYear,
              semester: studentEnrollment.studentSemester,
            },
            create_time: new Date(capture.create_time),
            update_time: new Date(capture.update_time),
          };
          if (Number(amountPaid) > 0) {
            if (prev.prelimBalance > 0) {
              type = 'prelim';
              amount = prev.prelimBalance;
              const createdReceipt = await createStudentReceipt({
                ...captures,
                year: prev.year,
                semester: prev.semester,
                schoolYear: prev.schoolYear,
                taxes: { amount: amountPaid > amount ? Number(amount || 0) : Number(amountPaid || 0) },
                'payer.address': d?.res?.purchase_units[0].shipping?.address,
                payment_source: payment_source,
                type,
              });
              if (!createdReceipt) return { error: 'Something went wrong.', status: 500 };
              amountPaid = Number(amountPaid - amount);
            }
          }
          if (Number(amountPaid) > 0) {
            if (prev.midtermBalance > 0) {
              type = 'midterm';
              amount = prev.midtermBalance;
              const createdReceipt = await createStudentReceipt({
                ...captures,
                year: prev.year,
                semester: prev.semester,
                schoolYear: prev.schoolYear,
                taxes: { amount: amountPaid > amount ? Number(amount || 0) : Number(amountPaid || 0) },
                'payer.address': d?.res?.purchase_units[0].shipping?.address,
                payment_source: payment_source,
                type,
              });
              if (!createdReceipt) return { error: 'Something went wrong.', status: 500 };
              amountPaid = Number(amountPaid - amount);
            }
          }
          if (Number(amountPaid) > 0) {
            if (prev.semiFinalBalance > 0) {
              type = 'semi-final';
              amount = prev.semiFinalBalance;
              const createdReceipt = await createStudentReceipt({
                ...captures,
                year: prev.year,
                semester: prev.semester,
                schoolYear: prev.schoolYear,
                taxes: { amount: amountPaid > amount ? Number(amount || 0) : Number(amountPaid || 0) },
                'payer.address': d?.res?.purchase_units[0].shipping?.address,
                payment_source: payment_source,
                type,
              });
              if (!createdReceipt) return { error: 'Something went wrong.', status: 500 };
              amountPaid = Number(amountPaid - amount);
            }
          }
          if (Number(amountPaid) > 0) {
            if (prev.finalBalance > 0) {
              type = 'final';
              amount = prev.finalBalance;
              const createdReceipt = await createStudentReceipt({
                ...captures,
                year: prev.year,
                semester: prev.semester,
                schoolYear: prev.schoolYear,
                taxes: { amount: amountPaid > amount ? Number(amount || 0) : Number(amountPaid || 0) },
                'payer.address': d?.res?.purchase_units[0].shipping?.address,
                payment_source: payment_source,
                type,
              });
              if (!createdReceipt) return { error: 'Something went wrong.', status: 500 };
              amountPaid = Number(amountPaid - amount);
            }
          }

          amountPaid = Number(amountPaid - amount);
        }
      }
    }
    const createdReceipt = await createStudentReceipt(data2);
    if (!createdReceipt) return { error: 'Something went wrong.', status: 500 };

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
  return { success: true, status: 201, res };
}

const checkBalance = async (currentYear: string, currentSemester: string, profileId: string, studentReceipt: any) => {
  return tryCatch(async () => {
    // Fetch enrollment records for this student
    const enrollmentRecords = await getEnrollmentRecordByProfileId(profileId);

    if (!enrollmentRecords || enrollmentRecords.length === 0) {
      console.log('No enrollment records found.');
      return;
    }

    // Get current year & semester index
    const currentYearIndex = studentYearData.findIndex((y) => y.title === currentYear);
    const currentSemIndex = studentSemesterData.findIndex((s) => s.title === currentSemester);

    // Sort enrollment records by year & semester (oldest first)
    const sortedRecords = enrollmentRecords.sort((a, b) => {
      let yearA = studentYearData.findIndex((y) => y.title === a.studentYear);
      let yearB = studentYearData.findIndex((y) => y.title === b.studentYear);
      let semA = studentSemesterData.findIndex((s) => s.title === a.studentSemester);
      let semB = studentSemesterData.findIndex((s) => s.title === b.studentSemester);

      if (yearA !== yearB) return yearA - yearB;
      return semA - semB;
    });

    // console.log('Sorted Enrollment Records:', sortedRecords);

    // Loop through past records and check balances
    let previousBalance = [];
    let overAllBalance = 0;
    let overAllShowBalance = 0;
    for (const record of sortedRecords) {
      const recordYearIndex = studentYearData.findIndex((y) => y.title === record.studentYear);
      const recordSemIndex = studentSemesterData.findIndex((s) => s.title === record.studentSemester);

      // Check only past enrollments (before current year/sem)
      if (recordYearIndex < currentYearIndex || (recordYearIndex === currentYearIndex && recordSemIndex < currentSemIndex)) {
        const getTotal = await getTotalOfBalance(record, studentReceipt);
        previousBalance.push({ year: record.studentYear, semester: record.studentSemester, ...getTotal });
        overAllBalance += Number(getTotal.balance || 0);
        overAllShowBalance += Number(getTotal.balanceToShow || 0);
      }
    }

    return { previousBalance, overAllBalance, overAllShowBalance }; // No outstanding balance
  });
};

const getTotalOfBalance = async (enrollment: any, studentReceipt: any) => {
  return tryCatch(async () => {
    const courseFee = await getCourseFeeByCourseCodeAndYearAndSemester(enrollment.studentYear, enrollment.studentSemester, enrollment.courseCode);

    const lab = enrollment.studentSubjects.reduce((acc: number, subject: any) => acc + Number(subject?.subject?.lab || 0), 0);
    const unit = enrollment.studentSubjects.reduce((acc: number, subject: any) => acc + Number(subject?.subject?.unit || 0), 0);

    const tFee = courseFee || {};
    const regMisc = tFee?.regOrMisc || [];
    const regMiscNew = tFee?.regOrMiscNew || [];

    const labTotal = parseFloat((lab * tFee.ratePerLab).toFixed(2));
    const lecTotal = parseFloat((unit * tFee.ratePerUnit).toFixed(2));
    const regMiscTotal = parseFloat(regMisc.reduce((acc: number, fee: any) => acc + Number(fee.amount), 0).toFixed(2));
    const regMiscNewTotal = parseFloat(regMiscNew.reduce((acc: number, fee: any) => acc + Number(fee.amount), 0).toFixed(2));

    let RegMiscTotal = 0;
    if (tFee?.regOrMiscWithOldAndNew) {
      if (enrollment?.studentStatus.toLowerCase() === 'new student' || enrollment?.studentStatus.toLowerCase() === 'transfer student') {
        RegMiscTotal = regMiscNewTotal;
      } else {
        RegMiscTotal = regMiscTotal;
      }
    } else {
      RegMiscTotal = regMiscTotal;
    }

    let totalAmount = Number(labTotal || 0) + Number(lecTotal || 0) + Number(RegMiscTotal || 0);

    // Check if CWTS/NSTP fee applies
    const hasCwtsOrNstp = enrollment.studentSubjects.some((sub: any) => ['cwts', 'nstp', 'nstp1', 'nstp2', 'cwts1', 'cwts2'].includes(sub?.subject?.subjectCode.trim().toLowerCase()));
    if (hasCwtsOrNstp) totalAmount += Number(tFee?.cwtsOrNstpFee || 0);

    // Check if OJT fee applies
    const hasOjt = enrollment.studentSubjects.some((sub: any) => ['prac1', 'prac2'].includes(sub?.subject?.subjectCode.trim().toLowerCase()));
    if (hasOjt) totalAmount += Number(tFee?.ojtFee || 0);

    // Deduct scholarship if applicable
    // const isPaidByScholarship = studentReceipt?.filter((r: any) => r.isPaidByScholarship)?.reduce((total: number, payment: any) => total + (Number(payment?.taxes?.amount) || 0), 0);

    // const totalAfterScholarship = totalAmount - isPaidByScholarship;

    // Check outstanding balance after payments
    let remainingShowBalance = 0;
    let remainingBalance = 0;

    const filteredReceipts = studentReceipt?.filter((r: any) => r.year.toLowerCase() === enrollment.studentYear.toLowerCase() && r.semester.toLowerCase() === enrollment.studentSemester.toLowerCase());

    const paymentOfFullPayment = filteredReceipts.find((r: any) => r.type.toLowerCase() === 'fullpayment');
    let showPaymentOfFullPayment = false;
    const paymentOfDownPayment = filteredReceipts.find((r: any) => r.type.toLowerCase() === 'downpayment');

    const totalPerTerm = Math.round(totalAmount * 100) / 100;
    const paymentPerTermNotRoundOff = Math.ceil((totalPerTerm / 4) * 100) / 100;
    const paymentPerTermRoundOff = paymentPerTermNotRoundOff % 100 >= 1 ? Math.ceil(paymentPerTermNotRoundOff / 100) * 100 : Math.floor(paymentPerTermNotRoundOff / 100) * 100;
    const paymentPerTerm = Number(paymentPerTermRoundOff);

    const paymentOfPrelim = filteredReceipts?.filter((r: any) => r.type.toLowerCase() === 'prelim')?.reduce((total: number, payment: any) => total + (Number(payment?.taxes?.amount) || 0), 0);
    const prelimPayment = Number(paymentOfPrelim) - Number(paymentPerTerm);

    const paymentOfMidterm = filteredReceipts?.filter((r: any) => r.type.toLowerCase() === 'midterm')?.reduce((total: number, payment: any) => total + (Number(payment?.taxes?.amount) || 0), 0);
    const midtermPayment = Number(paymentOfMidterm) - Number(paymentPerTerm);

    const paymentOfSemiFinal = filteredReceipts?.filter((r: any) => r.type.toLowerCase() === 'semi-final')?.reduce((total: number, payment: any) => total + (Number(payment?.taxes?.amount) || 0), 0);
    const semiFinalPayment = Number(paymentOfSemiFinal) - Number(paymentPerTerm);

    const paymentOfFinal = filteredReceipts?.filter((r: any) => r.type.toLowerCase() === 'final')?.reduce((total: number, payment: any) => total + (Number(payment?.taxes?.amount) || 0), 0);
    const final = parseFloat((totalAmount - Number(paymentOfDownPayment?.taxes?.amount || 0) - 3 * paymentPerTerm).toFixed(2));
    const finalPayment = Number(paymentOfFinal) - Number(final);

    if (!showPaymentOfFullPayment) {
      const totalBalance = Number(totalAmount);
      const paidAmount = Number(paymentOfDownPayment?.taxes?.amount || 0) + Number(paymentOfPrelim || 0) + Number(paymentOfMidterm || 0) + Number(paymentOfSemiFinal || 0) + Number(paymentOfFinal || 0);

      remainingBalance = Math.round((totalBalance - paidAmount) * 100) / 100;
    } else {
      remainingBalance = 0;
    }
  });
};
