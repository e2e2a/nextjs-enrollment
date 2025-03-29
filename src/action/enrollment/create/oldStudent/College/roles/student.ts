'use server';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { createEnrollment, getEnrollmentByUserId } from '@/services/enrollment';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import { getEnrollmentRecordByProfileId } from '@/services/enrollmentRecord';
import StudentProfile from '@/models/StudentProfile';
import { getCourseFeeByCourseCodeAndYearAndSemester } from '@/services/courseFeeRecord';
import { getStudentReceiptByStudentId } from '@/services/studentReceipt';
import { isScholarshipApplicable } from '@/constant/scholarship';

export const handleStudentRole = async (user: any, data: any) => {
  return tryCatch(async () => {
    const checkEnrollment = await getEnrollmentByUserId(user._id);
    if (checkEnrollment) return { error: 'You are already Enrolled/Enrolling.', status: 409 };
    const profile = await getStudentProfileByUserId(user._id);
    if (!profile) return { error: 'You are enrolling without a profile.', status: 403 };

    // if (data.studentStatus.toLowerCase() === 'returning' && data.studentSemester.toLowerCase() !== 'summer') {
    //   if (!record) return { error: 'No record found', status: 403 };
    //   console.log('asd', dataa);

    //   if (profile.studentSemester !== data.studentSemester) {
    //     return { message: 'Returning students needs to wait for the next available enrollment period', status: 403 };
    //   }
    // }
    let studentReceipt;
    const a = await getStudentReceiptByStudentId(profile?._id);
    studentReceipt = a;
    if (data.studentSemester.toLowerCase() !== 'summer') {
      const a = await checkBalance(profile._id, studentReceipt);

      for (const prev of a.previousBalance) {
        const fiftyPercent = a?.total * 0.5;
        if (prev?.balance > fiftyPercent) {
          console.log('Balance exceeds 50% of the total amount.');
          return { error: `Please double check your enrollment record and it has a balance of ${a?.balance}`, status: 400 };
        } else {
          console.log('Balance is within 50% of the total amount.');
        }
      }
    }
    await storeEnrollment(user, profile, data);
    await updateProfile(profile, data);
    return { message: 'hello world success', status: 201 };
  });
};

const storeEnrollment = async (user: any, profile: any, data: any) => {
  return tryCatch(async () => {
    data.userId = user._id;
    data.profileId = profile._id;
    data.courseId = profile.courseId._id;
    data.onProcess = true;
    // data.category = 'College';

    const cc = await createEnrollment(data);
    if (!cc) return { message: 'Something went wrong.', status: 500 };
  });
};

const updateProfile = async (profile: any, data: any) => {
  return tryCatch(async () => {
    const dataToUpdateProfile = {
      studentYear: data.studentYear,
      studentSemester: data.studentSemester,
      enrollStatus: 'Pending',

      numberStreet: data.numberStreet,
      barangay: data.barangay,
      district: data.district,
      cityMunicipality: data.cityMunicipality,
      province: data.province,
      contact: data.contact,
      civilStatus: data.civilStatus,
    };
    const updatedProfile = await StudentProfile.findByIdAndUpdate(profile._id, dataToUpdateProfile);
    if (!updatedProfile) return { message: 'Something went wrong.', status: 500 };
  });
};

const checkBalance = async (profileId: string, studentReceipt: any) => {
  return tryCatch(async () => {
    // Fetch enrollment records for this student
    let enrollmentRecords;
    const a = await getEnrollmentRecordByProfileId(profileId);
    enrollmentRecords = a?.filter((s) => s.enrollStatus?.toLowerCase() !== 'withdraw');
    if (!enrollmentRecords || enrollmentRecords.length === 0) {
      return;
    }

    let previousBalance = [];
    let overAllBalance = 0;
    let overAllShowBalance = 0;
    for (const record of enrollmentRecords) {
      // Check only past enrollments (before current year/sem)
      const getTotal = await getTotalOfBalance(record, studentReceipt);
      previousBalance.push({ year: record?.studentYear, semester: record?.studentSemester, schoolYear: record?.schoolYear, id: record._id.toString(), ...getTotal });
      overAllBalance += Number(getTotal.balance || 0);
      overAllShowBalance += Number(getTotal.balanceToShow || 0);
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
      if (enrollment?.studentStatus.toLowerCase() === 'new student' || enrollment?.studentStatus.toLowerCase() === 'transfer student' || enrollment?.studentStatus.toLowerCase() === 'transferee') {
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

    const scholarship = isScholarshipApplicable(enrollment?.studentYear || 'e2e2a', enrollment?.studentSemester || 'e2e2a', enrollment?.profileId?.scholarshipId?.amount || 'e2e2a');
    if (scholarship) {
      remainingBalance = 0;
    }

    return { total: totalAmount, balance: remainingBalance, balanceToShow: remainingShowBalance, prelimBalance, midtermBalance, semiFinalBalance, finalBalance };
  });
};
