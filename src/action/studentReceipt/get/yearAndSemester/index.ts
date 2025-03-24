'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getStudentReceiptByStudentId } from '@/services/studentReceipt';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import { checkAuth } from '@/utils/actions/session';
import { getCourseFeeByCourseId } from '@/services/courseFee';
import { getEnrollmentRecordByProfileId } from '@/services/enrollmentRecord';
import { isScholarshipApplicable } from '@/constant/scholarship';
import { getCourseFeeByCourseCodeAndYearAndSemester, getCourseFeeRecordByCourseCode } from '@/services/courseFeeRecord';
import { lookup } from 'dns';
import { studentSemesterData, studentYearData } from '@/constant/enrollment';

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
    console.log('year', year, semester);
    const student = await getStudentProfileByUserId(userId);
    let studentReceipt;
    const a = await getStudentReceiptByStudentId(student._id);
    studentReceipt = a;
    if (!year && !semester && !schoolYear) return { error: 'Invalid inputs', status: 400 };
    const c = await checkPaymentOfInsurance(studentReceipt, year, schoolYear);
    const checkedBalance = await checkBalance(year, semester, student._id, studentReceipt);
    // this is the insurance space for searching the insurance by semester and year
    studentReceipt = a.filter((sr) => sr.year.toLowerCase() === year.toLowerCase() && sr.semester.toLowerCase() === semester.toLowerCase() && sr.schoolYear.toLowerCase() === schoolYear.toLowerCase());

    return { studentReceipt: JSON.parse(JSON.stringify(studentReceipt)), ...c, ...checkedBalance, status: 200 };
  });
};

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
      let yearA = studentYearData.findIndex((y) => y?.title === a?.studentYear);
      let yearB = studentYearData.findIndex((y) => y?.title === b?.studentYear);
      let semA = studentSemesterData.findIndex((s) => s?.title === a?.studentSemester);
      let semB = studentSemesterData.findIndex((s) => s.title === b?.studentSemester);

      if (yearA !== yearB) return yearA - yearB;
      return semA - semB;
    });

    // console.log('Sorted Enrollment Records:', sortedRecords);

    // Loop through past records and check balances
    let previousBalance = [];
    let overAllBalance = 0;
    let overAllShowBalance = 0;
    for (const record of sortedRecords) {
      const recordYearIndex = studentYearData.findIndex((y) => y?.title === record?.studentYear);
      const recordSemIndex = studentSemesterData.findIndex((s) => s?.title === record?.studentSemester);

      // Check only past enrollments (before current year/sem)
      if (recordYearIndex < currentYearIndex || (recordYearIndex === currentYearIndex && recordSemIndex < currentSemIndex)) {
        const getTotal = await getTotalOfBalance(record, studentReceipt);
        previousBalance.push({ year: record?.studentYear, semester: record?.studentSemester, schoolYear: record?.schoolYear, ...getTotal });
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
    const checkBalanceLoop = [1, 2];
    let remainingShowBalance = 0;
    let remainingBalance = 0;
    let prelimBalance = 0;
    let midtermBalance = 0;
    let semiFinalBalance = 0;
    let finalBalance = 0;

    for (const loop of checkBalanceLoop) {
      const filteredReceipts =
        loop === 1
          ? studentReceipt?.filter((r: any) => r.year.toLowerCase() === enrollment.studentYear.toLowerCase() && r.semester.toLowerCase() === enrollment.studentSemester.toLowerCase() && !r.isPaidIn?.year && !r.isPaidIn?.semester)
          : studentReceipt?.filter((r: any) => r.year.toLowerCase() === enrollment.studentYear.toLowerCase() && r.semester.toLowerCase() === enrollment.studentSemester.toLowerCase());

      const paymentOfFullPayment = filteredReceipts.find((r: any) => r?.type?.toLowerCase() === 'fullpayment');
      let showPaymentOfFullPayment = paymentOfFullPayment;
      const paymentOfDownPayment = filteredReceipts.find((r: any) => r?.type?.toLowerCase() === 'downpayment');

      const totalWithoutDownPayment = Number(totalAmount) - Number(paymentOfDownPayment?.taxes?.amount);
      const totalPerTerm = Math.round(totalWithoutDownPayment * 100) / 100;
      const paymentPerTermNotRoundOff = Math.ceil((totalPerTerm / 4) * 100) / 100;
      const paymentPerTermRoundOff = paymentPerTermNotRoundOff % 100 >= 1 ? Math.ceil(paymentPerTermNotRoundOff / 100) * 100 : Math.floor(paymentPerTermNotRoundOff / 100) * 100;
      const paymentPerTerm = Number(paymentPerTermRoundOff);

      const paymentOfPrelim = filteredReceipts?.filter((r: any) => r.type.toLowerCase() === 'prelim')?.reduce((total: number, payment: any) => total + (Number(payment?.taxes?.amount) || 0), 0);
      if (loop === 2) prelimBalance = Number(paymentPerTerm) - Number(paymentOfPrelim);

      const paymentOfMidterm = filteredReceipts?.filter((r: any) => r.type.toLowerCase() === 'midterm')?.reduce((total: number, payment: any) => total + (Number(payment?.taxes?.amount) || 0), 0);
      if (loop === 2) midtermBalance = Number(paymentPerTerm) - Number(paymentOfMidterm);

      const paymentOfSemiFinal = filteredReceipts?.filter((r: any) => r.type.toLowerCase() === 'semi-final')?.reduce((total: number, payment: any) => total + (Number(payment?.taxes?.amount) || 0), 0);
      if (loop === 2) semiFinalBalance = Number(paymentPerTerm) - Number(paymentOfSemiFinal);

      const paymentOfFinal = filteredReceipts?.filter((r: any) => r.type.toLowerCase() === 'final')?.reduce((total: number, payment: any) => total + (Number(payment?.taxes?.amount) || 0), 0);
      const final = parseFloat((totalAmount - Number(paymentOfDownPayment?.taxes?.amount || 0) - 3 * paymentPerTerm).toFixed(2));
      if (loop === 2) finalBalance = Number(final) - Number(paymentOfFinal);

      if (!showPaymentOfFullPayment) {
        const totalBalance = Number(totalAmount);
        const paidAmount = Number(paymentOfDownPayment?.taxes?.amount || 0) + Number(paymentOfPrelim || 0) + Number(paymentOfMidterm || 0) + Number(paymentOfSemiFinal || 0) + Number(paymentOfFinal || 0);

        if (loop === 1) {
          remainingShowBalance = Math.round((totalBalance - paidAmount) * 100) / 100;
        } else {
          remainingBalance = Math.round((totalBalance - paidAmount) * 100) / 100;
        }
      } else {
        if (loop === 1) {
          remainingShowBalance = 0;
        } else {
          remainingBalance = 0;
        }
      }
    }

    return { total: totalAmount, balance: remainingBalance, balanceToShow: remainingShowBalance, prelimBalance, midtermBalance, semiFinalBalance, finalBalance };
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
    const fullpayment = a
      ?.filter((r: any) => r.type.toLowerCase() === 'fullpayment')
      ?.sort((a: any, b: any) => {
        // Sorting by school year first, then semester
        if (a.schoolYear !== b.schoolYear) {
          return a.schoolYear.localeCompare(b.schoolYear);
        }
        return a.semester.localeCompare(b.semester);
      })
      ?.reduce((acc: any, payment: any, index: number) => {
        if (index === 0) {
          return {
            amount: Number(payment?.taxes?.amount) || 0,
            semester: payment.semester,
            schoolYear: payment.schoolYear,
          };
        }
        return acc; // Keep only the first (oldest) entry
      }, null);
    if (insurancePayment1) insurancePayment = true;
    if (fullpayment) insurancePayment = true;
    return { insurancePayment, insurancePaymentSemester: insurancePayment1?.semester || fullpayment?.semester };
  });
};
