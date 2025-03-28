'use server';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { updateStudentReceiptById } from '@/services/studentReceipt';
import { checkAuth } from '@/utils/actions/session';

export const refundStudentReceiptAction = async (data: any) => {
  return tryCatch(async () => {
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };
    const checkedDownPayment = await checkRefundPaymentExceed(session?.user, data);
    if (!checkedDownPayment || checkedDownPayment.error) return { error: 'Your information false, Payment has been refunded.', status: 403 };

    return checkedDownPayment;
  });
};

const checkRefundPaymentExceed = async (user: any, data: any) => {
  return tryCatch(async () => {
    const refundAmount = data?.srData
      .filter((s: any) => s?.type.toLowerCase() !== 'ssg' && s?.type.toLowerCase() !== 'departmental' && s?.type.toLowerCase() !== 'insurance' && s?.type.toLowerCase() !== 'passbook' && !s?.isPaidByScholarship)
      ?.reduce((total: number, payment: any) => {
        return total + (Number(payment?.refundAmount || 0) || 0);
      }, 0);

    if (refundAmount >= data?.refundAmount) return { error: 'The Refund Amount is Already refunded.', category: data.category, status: 201 };

    let totalRefund = data?.refundAmount;
    const filteredReceipts = data?.srData.filter((s: any) => s?.type.toLowerCase() !== 'ssg' && s?.type.toLowerCase() !== 'departmental' && s?.type.toLowerCase() !== 'insurance' && s?.type.toLowerCase() !== 'passbook');
    const filteredFinal = filteredReceipts?.filter((s: any) => s?.type?.toLowerCase() === 'final' && !s?.isPaidByScholarship);
    if (filteredFinal.length > 0) {
      for (const a of filteredFinal) {
        if (totalRefund <= 0) return;
        let r = 0;
        if (Number(a?.taxes?.amount) > Number(totalRefund)) {
          r = Number(totalRefund);
        } else {
          r = Number(a?.taxes?.amount);
        }
        await updateStudentReceiptById(a._id, { refundAmount: r });
        totalRefund = totalRefund - r;
        console.log('totalRefund', totalRefund, a._id);
      }
    }
    const filteredSemiFinal = filteredReceipts?.filter((s: any) => s?.type?.toLowerCase() === 'semi-final' && !s?.isPaidByScholarship);
    if (filteredSemiFinal.length > 0) {
      for (const a of filteredSemiFinal) {
        if (totalRefund <= 0) return;
        let r = 0;
        if (Number(a?.taxes?.amount) > Number(totalRefund)) {
          r = Number(totalRefund);
        } else {
          r = Number(a?.taxes?.amount);
        }
        await updateStudentReceiptById(a._id, { refundAmount: r });
        totalRefund = totalRefund - r;
        console.log('totalRefund', totalRefund, a._id);
      }
    }
    const filteredMidterm = filteredReceipts?.filter((s: any) => s?.type?.toLowerCase() === 'midterm' && !s?.isPaidByScholarship);
    if (filteredMidterm.length > 0) {
      for (const a of filteredMidterm) {
        if (totalRefund <= 0) return;
        let r = 0;
        if (Number(a?.taxes?.amount) > Number(totalRefund)) {
          r = Number(totalRefund);
        } else {
          r = Number(a?.taxes?.amount);
        }
        await updateStudentReceiptById(a._id, { refundAmount: r });
        totalRefund = totalRefund - r;
        console.log('totalRefund', totalRefund, a._id);
      }
    }
    const filteredPrelim = filteredReceipts?.filter((s: any) => s?.type?.toLowerCase() === 'prelim' && !s?.isPaidByScholarship);
    if (filteredPrelim.length > 0) {
      for (const a of filteredPrelim) {
        if (totalRefund <= 0) return;
        let r = 0;
        if (Number(a?.taxes?.amount) > Number(totalRefund)) {
          r = Number(totalRefund);
        } else {
          r = Number(a?.taxes?.amount);
        }
        await updateStudentReceiptById(a._id, { refundAmount: r });
        totalRefund = totalRefund - r;
        console.log('totalRefund', totalRefund, a._id);
      }
    }
    const filteredDownPayment = filteredReceipts?.filter((s: any) => s?.type?.toLowerCase() === 'downpayment' && !s?.isPaidByScholarship);
    if (filteredDownPayment.length > 0) {
      for (const a of filteredDownPayment) {
        if (totalRefund <= 0) return;
        let r = 0;
        if (Number(a?.taxes?.amount) > Number(totalRefund)) {
          r = Number(totalRefund);
        } else {
          r = Number(a?.taxes?.amount);
        }
        await updateStudentReceiptById(a._id, { refundAmount: r });
        totalRefund = totalRefund - r;
        console.log('totalRefund', totalRefund, a._id);
      }
    }

    return { success: true, message: 'Successful Refund Payment.', category: data.category, status: 201 };
    // return { success: true, message: 'Successful Payment, Receipt has been created.', userId: student?.userId?._id.toString(), category: data.category, status: 201 };
  });
};
