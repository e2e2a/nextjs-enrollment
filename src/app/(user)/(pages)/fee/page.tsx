'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LoaderPage from '@/components/shared/LoaderPage';
import { useCourseFeeQueryByCourseIdAndYear } from '@/lib/queries/courseFee/get/courseId';
import { useSession } from 'next-auth/react';
import { useEnrollmentQueryBySessionId } from '@/lib/queries/enrollment/get/session';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEnrollmentSetupQuery } from '@/lib/queries/enrollmentSetup/get';
import SettleTermPayment from './components/SettleTermPayment';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { exportToPDF } from './components/ExportUtils';
import { Icons } from '@/components/shared/Icons';
import { GeneratePDF } from './components/GeneratePDF';
import { isScholarshipApplicable } from '@/constant/scholarship';
import { useStudentReceiptQueryByUserIdAndYearAndSemester } from '@/lib/queries/studentReceipt/get/yearAndSemester';

const Page = () => {
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0.0);
  const [totalWithoutDownPayment, setTotalWithoutDownPayment] = useState<number>(0.0);
  const [additionalTotal, setAdditionalTotal] = useState<number>(0.0);
  const [showBalance, setShowBalance] = useState<number>(0.0);
  const [paymentPerTerm, setPaymentPerTerm] = useState<number>(0.0);
  const [labTotal, setLabTotal] = useState<number>(0.0);
  const [lecTotal, setLecTotal] = useState<number>(0.0); // consider in the tuition fee
  const [regMiscTotal, setRegMiscTotal] = useState<number>(0.0);
  const [showCwtsOrNstp, setShowCwtsOrNstp] = useState<boolean>(false);
  const [showOJT, setShowOJT] = useState<boolean>(false);

  const { data: session } = useSession();
  const { data, error } = useEnrollmentQueryBySessionId(session?.user?.id!);
  const { data: tfData, error: isTFError } = useCourseFeeQueryByCourseIdAndYear(data?.enrollment?.studentYear, data?.enrollment?.courseId?._id || 'e2e2a');
  const { data: esData, isError: esError } = useEnrollmentSetupQuery();
  const { data: srData, error: srError } = useStudentReceiptQueryByUserIdAndYearAndSemester(session?.user.id as string, data?.enrollment?.studentYear, data?.enrollment?.studentSemester, esData?.enrollmentSetup?.enrollmentTertiary?.schoolYear);

  //to be deducted amount of scholarship payment
  const isPaidByScholarship = srData?.studentReceipt
    ?.filter((r: any) => r.isPaidByScholarship)
    ?.reduce((total: number, payment: any) => {
      return total + (Number(payment?.taxes?.amount) || 0);
    }, 0);
  const balanceGrant = parseFloat((Number(data?.enrollment?.profileId?.scholarshipId?.amount) - Number(isPaidByScholarship)).toFixed(2));

  //full payment exclude all terms payment and downpayment
  const paymentOfFullPayment = srData?.studentReceipt.find((r: any) => r.type.toLowerCase() === 'fullpayment');
  let showPaymentOfFullPayment = false;
  const totalofPerTermFullPayment = Math.round(Number(total - total * 0.1) * 100) / 100;
  showPaymentOfFullPayment =
    paymentOfFullPayment &&
    Math.round(Number(paymentOfFullPayment?.taxes?.amount) * 100) / 100 >= Math.round(Number(totalofPerTermFullPayment + Number(tfData?.tFee?.ssgFee || 0) + Number(tfData?.tFee?.departmentalFee || 0) + Number(tfData?.tFee?.insuranceFee || 0)) * 100) / 100;

  const scholarship = isScholarshipApplicable(data?.enrollment?.studentYear, data?.enrollment?.studentSemester, data?.enrollment?.profileId?.scholarshipId);
  const isScholarshipStart = scholarship && data?.enrollment?.profileId?.scholarshipId;
  if (isScholarshipStart) showPaymentOfFullPayment = paymentOfFullPayment && Math.round(Number(paymentOfFullPayment?.taxes?.amount) * 100) / 100 === Math.round(Number(total) * 100) / 100;

  // Down Payment
  const paymentOfDownPayment = srData?.studentReceipt.find((r: any) => r.type.toLowerCase() === 'downpayment');
  const showPaymentOfDownPayment = paymentOfDownPayment && Number(paymentOfDownPayment?.taxes?.amount).toFixed(2) === Number(tfData?.tFee?.downPayment).toFixed(2);

  // Prelim Payment
  const paymentOfPrelim = srData?.studentReceipt
    ?.filter((r: any) => r.type.toLowerCase() === 'prelim')
    ?.reduce((total: number, payment: any) => {
      return total + (Number(payment?.taxes?.amount) || 0);
    }, 0);
  const a = Number(paymentOfPrelim) > 0 && Number(paymentOfPrelim) !== Number(paymentPerTerm);
  const prelimPayment = Number(paymentOfPrelim) - Number(paymentPerTerm);
  const showPaymentOfPrelim = paymentOfPrelim && prelimPayment >= 0;

  // Midterm Payment
  const paymentOfMidterm = srData?.studentReceipt
    ?.filter((r: any) => r.type.toLowerCase() === 'midterm')
    ?.reduce((total: number, payment: any) => {
      return total + (Number(payment?.taxes?.amount) || 0);
    }, 0);
  const b = Number(paymentOfMidterm) > 0 && Number(paymentOfMidterm) !== Number(paymentPerTerm);
  const midtermPayment = Number(paymentOfMidterm) - Number(paymentPerTerm);
  const showPaymentOfMidterm = paymentOfMidterm && midtermPayment >= 0;

  // Semi-final Payment
  const paymentOfSemiFinal = srData?.studentReceipt
    ?.filter((r: any) => r.type.toLowerCase() === 'semi-final')
    ?.reduce((total: number, payment: any) => {
      return total + (Number(payment?.taxes?.amount) || 0);
    }, 0);
  const c = Number(paymentOfSemiFinal) > 0 && Number(paymentOfSemiFinal) !== Number(paymentPerTerm);
  const semiFinalPayment = Number(paymentOfSemiFinal) - Number(paymentPerTerm);
  const showPaymentOfSemiFinal = paymentOfSemiFinal && semiFinalPayment >= 0;

  // Final Payment
  const paymentOfFinal = srData?.studentReceipt
    ?.filter((r: any) => r.type.toLowerCase() === 'final')
    ?.reduce((total: number, payment: any) => {
      return total + (Number(payment?.taxes?.amount) || 0);
    }, 0);
  const final = parseFloat((total - tfData?.tFee?.downPayment - 3 * paymentPerTerm).toFixed(2));
  const d = Number(paymentOfFinal) > 0 && Number(paymentOfFinal) !== Number(final);
  const finalPayment = Number(paymentOfFinal) - Number(final);
  const showPaymentOfFinal = paymentOfFinal && finalPayment >= 0;

  // Departmental Payment
  const paymentOfDepartmental = srData?.studentReceipt
    ?.filter((r: any) => r.type.toLowerCase() === 'departmental')
    ?.reduce((total: number, payment: any) => {
      return total + (Number(payment?.taxes?.amount) || 0);
    }, 0);
  const departmentalPayment = Number(paymentOfDepartmental) - Number(tfData?.tFee?.departmentalFee);
  const showPaymentOfDepartmental = paymentOfDepartmental && departmentalPayment >= 0;

  // Insurance Payment
  const paymentOfInsurance = srData?.studentReceipt
    ?.filter((r: any) => r.type.toLowerCase() === 'insurance')
    ?.reduce((total: number, payment: any) => {
      return total + (Number(payment?.taxes?.amount) || 0);
    }, 0);
  const insurancePayment = Number(paymentOfInsurance) - Number(tfData?.tFee?.insuranceFee);
  const showPaymentOfInsurance = paymentOfInsurance && insurancePayment >= 0;

  // SSG Payment
  const paymentOfSSG = srData?.studentReceipt
    ?.filter((r: any) => r.type.toLowerCase() === 'ssg')
    ?.reduce((total: number, payment: any) => {
      return total + (Number(payment?.taxes?.amount) || 0);
    }, 0);
  const ssgPayment = Number(paymentOfSSG) - Number(tfData?.tFee?.ssgFee);
  const showPaymentOfSSG = paymentOfSSG && ssgPayment >= 0;

  useEffect(() => {
    if (!showPaymentOfFullPayment) {
      const totalBalance = Number(totalWithoutDownPayment); // Total amount to be paid
      const paidAmount = Number(paymentOfPrelim || 0) + Number(paymentOfMidterm || 0) + Number(paymentOfSemiFinal || 0) + Number(paymentOfFinal || 0);

      const remainingBalance = Math.round((totalBalance - paidAmount) * 100) / 100;
      setShowBalance(remainingBalance);
    } else {
      // let a = Math.round((Number(paymentOfFullPayment?.taxes?.amount) + Number(total) * 0.1) * 100) / 100 - Math.round(Number(total) * 100) / 100;
      // if (isScholarshipStart && data?.enrollment?.profileId?.scholarshipId?.discountPercentage) a = Math.round(Number(paymentOfFullPayment?.taxes?.amount) * 100) / 100 - Math.round(Number(total) * 100) / 100;
      setShowBalance(0);
    }
  }, [total, paymentOfFullPayment, showPaymentOfFullPayment, paymentOfDownPayment, paymentOfPrelim, paymentOfMidterm, paymentOfSemiFinal, paymentOfFinal, showBalance, data, isScholarshipStart]);

  useEffect(() => {
    if (isTFError || !tfData) return;
    if (error || !data) return;
    if (esError || !esData) return;
    if (srError || !srData) return;

    if (tfData && data) {
      if (data.enrollment && tfData.tFee) {
        setLabTotal(0);
        setLecTotal(0);
        setRegMiscTotal(0);
        setTotal(0);
        setTotalWithoutDownPayment(0);
        const lab = data.enrollment.studentSubjects.reduce((acc: number, subjects: any) => acc + Number(subjects?.teacherScheduleId?.subjectId?.lab), 0);
        const unit = data.enrollment.studentSubjects.reduce((acc: number, subjects: any) => acc + Number(subjects?.teacherScheduleId?.subjectId?.unit), 0);

        // Ensure correct calculations at every step
        const aFormatted = parseFloat((lab * tfData?.tFee?.ratePerLab).toFixed(2));
        const bFormatted = parseFloat((unit * tfData?.tFee?.ratePerUnit).toFixed(2));
        const cFormatted = parseFloat(tfData?.tFee?.regOrMisc.reduce((acc: number, tFee: any) => acc + Number(tFee.amount), 0).toFixed(2));
        const dFormatted = Number(tfData?.tFee?.downPayment || 0);

        let addcwtsOrNstpFee = false;
        const cwtsOrNstpFee = Number(tfData?.tFee?.cwtsOrNstpFee) || 0;
        const cwtsOrNstp = data.enrollment.studentSubjects.find((sub: any) => {
          if (
            sub?.teacherScheduleId?.subjectId?.subjectCode.trim().toLowerCase() === 'cwts' ||
            sub?.teacherScheduleId?.subjectId?.subjectCode.trim().toLowerCase() === 'nstp' ||
            sub?.teacherScheduleId?.subjectId?.subjectCode.trim().toLowerCase() === 'nstp1' ||
            sub?.teacherScheduleId?.subjectId?.subjectCode.trim().toLowerCase() === 'nstp2' ||
            sub?.teacherScheduleId?.subjectId?.subjectCode.trim().toLowerCase() === 'cwts1' ||
            sub?.teacherScheduleId?.subjectId?.subjectCode.trim().toLowerCase() === 'cwts2'
          ) {
            setShowCwtsOrNstp(true);
            addcwtsOrNstpFee = true;
            return true;
          }
          return false;
        });

        let addOjtFee = false;
        const ojtFee = Number(tfData?.tFee?.ojtFee) || 0;
        const ojt = data.enrollment.studentSubjects.find((sub: any) => {
          if (sub?.teacherScheduleId?.subjectId?.subjectCode.trim().toLowerCase() === 'prac1' || sub?.teacherScheduleId?.subjectId?.subjectCode.trim().toLowerCase() === 'prac2') {
            setShowOJT(true);
            addOjtFee = true;
            return true;
          }
          return false;
        });

        setLabTotal(aFormatted);
        let LecTotal = bFormatted;
        setLecTotal(bFormatted);
        if (isScholarshipStart && data?.enrollment?.profileId?.scholarshipId?.exemptedFees.includes('Tuition Fee')) {
          if (data?.enrollment?.profileId?.scholarshipId?.type === 'percentage') {
            const b = parseFloat((bFormatted * Number(data?.enrollment?.profileId?.scholarshipId?.discountPercentage)).toFixed(2));
            const c = parseFloat((bFormatted - b).toFixed(2));
            LecTotal = c;
            setLecTotal(c);
          }
        }
        const a = cFormatted + dFormatted;
        setRegMiscTotal(a);
        let RegMiscTotal = a;
        if (isScholarshipStart && data?.enrollment?.profileId?.scholarshipId?.exemptedFees.includes('Miscellaneous Fees')) {
          if (data?.enrollment?.profileId?.scholarshipId?.type === 'percentage') {
            const b = parseFloat((a * Number(data?.enrollment?.profileId?.scholarshipId?.discountPercentage)).toFixed(2));
            const c = parseFloat((a - b).toFixed(2));
            RegMiscTotal = c;
            setRegMiscTotal(c);
          }
        }
        let totalAmount = 0;

        totalAmount = aFormatted + LecTotal + RegMiscTotal;
        if (addcwtsOrNstpFee) totalAmount = totalAmount + cwtsOrNstpFee;
        if (addOjtFee) totalAmount = totalAmount + ojtFee;
        const formattedTotal = parseFloat(totalAmount.toFixed(2)); // Final formatting
        setTotal(formattedTotal);
        const totalWithoutDownPayment = Number(formattedTotal) - dFormatted;
        setTotalWithoutDownPayment(totalWithoutDownPayment);
        const totalPerTerm = Math.round(totalWithoutDownPayment * 100) / 100;
        const paymentPerTerm = Math.ceil((totalPerTerm / 4) * 100) / 100;
        const paymentPerTermRoundOff = paymentPerTerm % 100 >= 35 ? Math.ceil(paymentPerTerm / 100) * 100 : Math.floor(paymentPerTerm / 100) * 100;

        setPaymentPerTerm(Number(paymentPerTermRoundOff));
      }
      setIsPageLoading(false);
      return;
    }
  }, [data, error, tfData, esData, esError, srData, srError, isTFError, isScholarshipStart]);

  useEffect(() => {
    let additionPayment = parseFloat((Number(tfData?.tFee?.downPayment) + Number(tfData?.tFee?.ssgFee) + Number(tfData?.tFee?.insuranceFee) + Number(tfData?.tFee?.departmentalFee)).toFixed(2));
    if (showPaymentOfDownPayment) additionPayment = parseFloat((additionPayment - tfData?.tFee?.downPayment).toFixed(2));
    if (showPaymentOfDepartmental) additionPayment = parseFloat((additionPayment - tfData?.tFee?.departmentalFee).toFixed(2));
    if (!srData?.ssgPayment && showPaymentOfSSG) additionPayment = parseFloat((additionPayment - tfData?.tFee?.ssgFee).toFixed(2));
    if (srData?.insurancePayment) additionPayment = parseFloat((additionPayment - tfData?.tFee?.insurancePayment).toFixed(2));
    if (srData?.ssgPayment) additionPayment = parseFloat((additionPayment - tfData?.tFee?.ssgFee).toFixed(2));

    setAdditionalTotal(additionPayment || 0);
    if (showPaymentOfFullPayment) setAdditionalTotal(0);
  }, [tfData, srData, showPaymentOfFullPayment, showPaymentOfDepartmental, showPaymentOfSSG]);

  const insurancePaidInThisSemester = srData?.insurancePaymentSemester?.toLowerCase() === data?.enrollment?.studentSemester?.toLowerCase();
  const ssgPaidInThisSemester =
    (srData?.ssgYear1?.toLowerCase() === data?.enrollment?.studentYear?.toLowerCase() && srData?.ssgSemester1?.toLowerCase() === data?.enrollment?.studentSemester?.toLowerCase()) ||
    (srData?.ssgYear2?.toLowerCase() === data?.enrollment?.studentYear?.toLowerCase() && srData?.ssgSemester2?.toLowerCase() === data?.enrollment?.studentSemester?.toLowerCase());
  // boolean for all required payments
  const myBooleanForInsurance = srData?.insurancePayment || insurancePaidInThisSemester;
  const myBooleanForSSG = srData?.ssgPayment || ssgPaidInThisSemester;
  const requiredPaymentsFulfill = showPaymentOfDownPayment && myBooleanForSSG && myBooleanForInsurance && showPaymentOfDepartmental;

  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <>
          {data?.enrollment ? (
            <>
              {tfData?.tFee && data.enrollment.step >= 5 && data?.enrollment?.enrollStatus.toLowerCase() !== 'withdraw' ? (
                <div className='border-0 bg-white rounded-xl min-h-[87vh]'>
                  {tfData?.tFee && (
                    <Accordion type='single' collapsible className='w-full p-10'>
                      <AccordionItem value='item-1' className='border-black'>
                        <AccordionTrigger>Summary</AccordionTrigger>
                        <AccordionContent className='border border-black'>
                          <Card className='border-0 py-5 bg-transparent border-black'>
                            <div className='flex justify-end mr-2'>
                              <Button
                                type='button'
                                onClick={() =>
                                  GeneratePDF(
                                    {
                                      regmiscAmount: Number(regMiscTotal).toFixed(2) || (0).toFixed(2),
                                      tuitionFeeAmount: Number(lecTotal).toFixed(2) || (0).toFixed(2),
                                      labFeeAmount: Number(labTotal).toFixed(2) || (0).toFixed(2),
                                      ...(showCwtsOrNstp ? { cwtsOrNstpFeeAmount: Number(tfData?.tFee?.cwtsOrNstpFee).toFixed(2) || (0).toFixed(2) } : {}),
                                      totalAmount: Number(total).toFixed(2) || (0).toFixed(2),
                                      departmentalFeeAmount: Number(tfData?.tFee?.departmentalFee).toFixed(2) || (0).toFixed(2),
                                      ssgFeeAmount: Number(tfData?.tFee?.ssgFee).toFixed(2) || (0).toFixed(2) || (0).toFixed(),
                                      total1YearFeeAmount: (Number(tfData?.tFee?.departmentalFee || 0) + Number(tfData?.tFee?.ssgFee || 0)).toFixed(2),
                                    },
                                    'Course Payment'
                                  )
                                }
                                className='select-none focus-visible:ring-0 text-[15px] bg-none hover:bg-blue-500 text-black hover:text-neutral-100 tracking-normal font-medium font-poppins flex items-center justify-center'
                              >
                                <Icons.download className='h-4 w-4 mr-1' /> Download
                              </Button>
                            </div>
                            <CardHeader className='space-y-3'>
                              <CardTitle className=''>
                                <div className='flex justify-between items-center'>
                                  <span className='text-lg xs:text-2xl font-semibold sm:text-3xl tracking-tight w-full text-start uppercase'>Summary</span>
                                  <Link href={`/fee/course`} className='hover:underline hover:text-blue-600 text-blue-500 space-y-2'>
                                    <Button size={'sm'} type='button' className='w-auto flex gap-2'>
                                      View More Details 👉
                                    </Button>
                                  </Link>
                                </div>
                              </CardTitle>
                              <CardDescription className='text-xs sm:text-sm'>Department: {tfData?.tFee?.courseId?.name}</CardDescription>
                            </CardHeader>
                            <CardContent className='w-full'>
                              <div className='grid grid-cols-1 sm:px-32 px-5'>
                                <div className='flex justify-between'>
                                  <span className='font-medium'>REG/MISC</span>
                                  <span>₱{Number(regMiscTotal - tfData?.tFee?.downPayment).toFixed(2) || (0).toFixed(2)}</span>
                                </div>
                                <div className='flex justify-between'>
                                  <span className='font-medium'>DOWN PAYMENT</span>
                                  <span>₱{Number(tfData?.tFee?.downPayment).toFixed(2) || (0).toFixed(2)}</span>
                                </div>
                                <div className='flex justify-between'>
                                  <span className='font-medium'>TUITION FEE</span>
                                  <span>₱{Number(lecTotal).toFixed(2) || (0).toFixed(2)}</span>
                                </div>
                                <div className='flex justify-between'>
                                  <span className='font-medium'>LAB FEE</span>
                                  <span>₱{Number(labTotal).toFixed(2) || (0).toFixed(2)}</span>
                                </div>
                                {showCwtsOrNstp && (
                                  <div className='flex justify-between'>
                                    <span className='font-medium'>CWTS/NSTP FEE</span>
                                    <span>₱{Number(tfData?.tFee?.cwtsOrNstpFee).toFixed(2) || (0).toFixed(2)}</span>
                                  </div>
                                )}
                                {showOJT && (
                                  <div className='flex justify-between'>
                                    <span className='font-medium'>OJT FEE</span>
                                    <span>₱{Number(tfData?.tFee?.ojtFee).toFixed(2) || (0).toFixed(2)}</span>
                                  </div>
                                )}
                              </div>
                              <div className='grid grid-cols-1 sm:px-36 px-5'>
                                <div className='flex justify-between'>
                                  <span className='font-medium'>Total</span>
                                  <span>₱{Number(total).toFixed(2) || (0).toFixed(2)}</span>
                                </div>
                              </div>
                              <div className='flex flex-col items-start w-full justify-center mt-10 mb-10'>
                                <h1 className='text-lg font-semibold sm:text-xl tracking-tight w-full text-start uppercase flex'>
                                  ADDITIONAL PAYMENT <span className='flex justify-start items-start text-[15px] text-red'>(Required)</span>
                                </h1>
                                <span className='text-sm text-muted-foreground mt-2'>
                                  The Departmental Fee is required every semester, while the Insurance Fee is only required once per year. The SSG Fee is required for the first two payments within a single academic year. After the first two payments, it will
                                  no longer be required for the remaining semesters.
                                </span>
                                <div className='grid grid-cols-1 w-full sm:px-32 px-5'>
                                  <div className='flex justify-between w-full'>
                                    <span className='font-medium'>Departmental Fee</span>
                                    <span>₱{Number(tfData?.tFee?.departmentalFee || 0).toFixed(2) || (0).toFixed(2)}</span>
                                  </div>
                                  <div className='flex justify-between'>
                                    <span className='font-medium'>Insurance Fee</span>
                                    <span>₱{Number(tfData?.tFee?.insuranceFee || 0).toFixed(2) || (0).toFixed(2)}</span>
                                  </div>
                                  <div className='flex justify-between'>
                                    <span className='font-medium'>SSG Fee</span>
                                    <span>₱{Number(tfData?.tFee?.ssgFee || 0).toFixed(2) || (0).toFixed(2)}</span>
                                  </div>
                                </div>
                                <div className='grid grid-cols-1 sm:px-36 w-full px-5'>
                                  <div className='flex justify-between'>
                                    <span className='font-medium'>Total</span>
                                    <span>₱{(Number(tfData?.tFee?.departmentalFee || 0) + Number(tfData?.tFee?.insuranceFee || 0) + Number(tfData?.tFee?.ssgFee || 0)).toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>

                            <CardFooter className=''></CardFooter>
                          </Card>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                  <div className='flex items-end justify-end pt-1 text-black w-full text-center pr-2'>
                    <Button
                      type='button'
                      onClick={() =>
                        exportToPDF(
                          data?.enrollment,
                          Number(tfData?.tFee?.downPayment),
                          paymentPerTerm,
                          parseFloat((total - tfData?.tFee?.downPayment - 3 * paymentPerTerm).toFixed(2)),
                          showPaymentOfFullPayment,
                          showPaymentOfDownPayment,
                          showPaymentOfPrelim,
                          showPaymentOfMidterm,
                          showPaymentOfSemiFinal,
                          showPaymentOfFinal,
                          Number(total).toFixed(2) || (0).toFixed(2),
                          Number(showBalance).toFixed(2) || (0).toFixed(2),
                          srData?.ssgPayment,
                          showPaymentOfDepartmental,
                          showPaymentOfSSG,
                          tfData?.tFee?.departmentalFee,
                          tfData?.tFee?.ssgFee,
                          Number(additionalTotal).toFixed(2),
                          'student payment'
                        )
                      }
                      className='select-none focus-visible:ring-0 text-[15px] bg-none hover:bg-blue-500 text-black hover:text-neutral-100 tracking-normal font-medium font-poppins flex items-center justify-center'
                    >
                      <Icons.download className='h-4 w-4 mr-1' /> Download
                    </Button>
                  </div>
                  <Card className='border-0 py-5 bg-transparent'>
                    <CardHeader className='space-y-3'>
                      <CardTitle className='text-lg xs:text-2xl sm:text-3xl tracking-tight w-full text-center uppercase'>Remaining Fee&apos;s</CardTitle>
                      <CardDescription className='text-xs sm:text-sm flex justify-between'>
                        <span className='text-xs sm:text-sm'>Department: {tfData?.tFee?.courseId?.name} </span>
                        <span className='text-xs sm:text-sm'>SchoolYear: {esData?.enrollmentSetup?.enrollmentTertiary?.schoolYear} </span>
                      </CardDescription>
                      <div className=''>
                        {!data?.enrollment?.profileId?.scholarshipId?.amount &&
                          !requiredPaymentsFulfill &&
                          !showPaymentOfFullPayment &&
                          !showPaymentOfDownPayment &&
                          !showPaymentOfPrelim &&
                          !showPaymentOfMidterm &&
                          !showPaymentOfSemiFinal &&
                          !showPaymentOfFinal && (
                            <div className='flex flex-col justify-center items-center w-full border-[0.5px] rounded-lg px-5 py-3'>
                              <div className='px-5 w-full sm:px-1 flex justify-center flex-col mt-5'>
                                <h1 className='flex gap-x-2 justify-center items-center'>
                                  <span className='text-[16px] font-bold text-orange-400'>Note:</span>
                                  <span className='text-sm text-justify'>
                                    Full payment for the semester is only applicable for the initial payment and includes a 10% discount. {isScholarshipStart && 'For more details 10% discount is only available for students who does not have a schollarship.'}
                                  </span>
                                </h1>
                              </div>
                              <div className=''>
                                <SettleTermPayment enrollment={data?.enrollment} tfData={tfData?.tFee} srData={srData?.studentReceipt} amountToPay={Number(total).toFixed(2)} type={'fullPayment'} title='Full Payment' isScholarshipStart={isScholarshipStart} />
                              </div>
                            </div>
                          )}
                      </div>
                      {isScholarshipStart && (
                        <>
                          {data?.enrollment?.profileId?.scholarshipId?.discountPercentage && (
                            <div className=''>
                              <h1 className='flex flex-col gap-x-2 justify-start items-start font-semibold text-green-500'>
                                <span className='text-sm text-justify'>Discounted:{parseFloat((data?.enrollment?.profileId?.scholarshipId?.discountPercentage * 100).toFixed(0))}%</span>
                                <span className='text-sm text-justify'>Exempted:{data?.enrollment?.profileId?.scholarshipId?.exemptedFees.join(', ')}</span>
                              </h1>
                            </div>
                          )}
                          {data?.enrollment?.profileId?.scholarshipId?.amount && (
                            <div className=''>
                              <div className='text-sm text-muted-foreground my-3'>
                                <span className=''>Note: Only Cashier can make a payment until the Scholarship Support Balance is zero.</span>
                              </div>
                              <h1 className='flex flex-col gap-x-2 justify-start items-start font-semibold '>
                                <span className='text-sm text-justify'>Scholarship Name: {data?.enrollment?.profileId?.scholarshipId?.name}</span>
                                <span className='text-sm text-justify'>
                                  Scholarship Support: <span className='text-green-500'>₱{parseFloat(Number(data?.enrollment?.profileId?.scholarshipId?.amount).toFixed(0))}</span>
                                </span>
                                <span className='text-sm text-justify'>
                                  Scholarship Support Balance: <span className='text-green-500'>₱{parseFloat((Number(data?.enrollment?.profileId?.scholarshipId?.amount) - isPaidByScholarship).toFixed(0))}</span>
                                </span>
                              </h1>
                            </div>
                          )}
                        </>
                      )}
                    </CardHeader>
                    <CardContent className='w-full'>
                      <div className=' mb-20 mt-5'>
                        <h1 className='text-lg md:text-xl tracking-tight w-full text-left font-semibold uppercase'>
                          Down Payment & Additional Fees <span className='text-red'>(REQUIRED)</span>
                        </h1>
                        <span className='text-sm text-muted-foreground mt-2'>
                          <span className='text-sm text-muted-foreground mt-2'>
                            To proceed with enrollment, students are required to settle the <strong>Down Payment</strong>, <strong>Insurance Fee</strong>, <strong>SSG Fee</strong>, and <strong>Departmental Fee</strong>. The <strong>Departmental Fee</strong> is
                            mandatory every semester, while the <strong>Insurance Fee</strong> is only required once per academic year. The <strong>SSG Fee</strong> is mandatory for the first two payments within a single academic year. After these two
                            payments, it will no longer be required for the remaining semesters.
                            <span className='text-red-500 font-semibold'>Enrollment will not be processed until all required fees have been fully paid.</span>
                          </span>
                        </span>
                        <div className='grid grid-cols-1 sm:px-32 px-5'>
                          <Table className='table-auto border-collapse rounded-t-lg border '>
                            <TableHeader>
                              <TableRow className=' border-black rounded-t-lg bg-gray-200 font-bold text-[16px]'>
                                <TableHead className='px-4 py-2 text-left'>Payments Type</TableHead>
                                <TableHead className='px-4 py-2 text-left'>Amount</TableHead>
                                <TableHead className='px-4 py-2 text-left'>Status</TableHead>
                                {(!data?.enrollment?.profileId?.scholarshipId?.amount || (data?.enrollment?.profileId?.scholarshipId?.amount && Number(balanceGrant) === 0)) && <TableHead className='px-4 py-2 text-left'>Settle Payment</TableHead>}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className={`px-4 py-2 ${(showPaymentOfFullPayment || showPaymentOfDownPayment) && 'text-green-400 line-through'}`}>Down Payment</TableCell>
                                <TableCell className={`px-4 py-2 ${(showPaymentOfFullPayment || showPaymentOfDownPayment) && 'text-green-400 line-through'}`}>₱{Number(tfData?.tFee?.downPayment).toFixed(2)}</TableCell>
                                <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfFullPayment || showPaymentOfDownPayment ? 'text-green-400' : 'text-red'}`}>
                                  {showPaymentOfFullPayment || showPaymentOfDownPayment ? 'Paid' : 'unpaid'}
                                </TableCell>
                                {(!data?.enrollment?.profileId?.scholarshipId?.amount || (data?.enrollment?.profileId?.scholarshipId?.amount && Number(balanceGrant) === 0)) && (
                                  <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfFullPayment || showPaymentOfDownPayment ? 'text-green-400' : 'text-red'}`}>
                                    {showPaymentOfFullPayment || showPaymentOfDownPayment ? (
                                      'Completed'
                                    ) : (
                                      <SettleTermPayment
                                        enrollment={data?.enrollment}
                                        tfData={tfData?.tFee}
                                        srData={srData?.studentReceipt}
                                        amountToPay={Number(tfData?.tFee?.downPayment).toFixed(2)}
                                        type={'downPayment'}
                                        title='Down Payment'
                                        isScholarshipStart={isScholarshipStart}
                                      />
                                    )}
                                  </TableCell>
                                )}
                              </TableRow>
                              <TableRow>
                                <TableCell className={`px-4 py-2 ${(showPaymentOfFullPayment || showPaymentOfDepartmental) && 'text-green-400 line-through'}`}>Departmental Fee</TableCell>
                                <TableCell className={`px-4 py-2 ${(showPaymentOfFullPayment || showPaymentOfDepartmental) && 'text-green-400 line-through'}`}>₱{Number(tfData?.tFee?.departmentalFee).toFixed(2)}</TableCell>
                                <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfFullPayment || showPaymentOfDepartmental ? 'text-green-400' : 'text-red'}`}>
                                  {showPaymentOfFullPayment || showPaymentOfDepartmental ? 'Paid' : 'unpaid'}
                                </TableCell>
                                {(!data?.enrollment?.profileId?.scholarshipId?.amount || (data?.enrollment?.profileId?.scholarshipId?.amount && Number(balanceGrant) === 0)) && (
                                  <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfFullPayment || showPaymentOfDepartmental ? 'text-green-400' : 'text-red'}`}>
                                    {showPaymentOfFullPayment || showPaymentOfDepartmental ? (
                                      'Completed'
                                    ) : showPaymentOfDownPayment ? (
                                      <SettleTermPayment
                                        enrollment={data?.enrollment}
                                        tfData={tfData?.tFee}
                                        srData={srData?.studentReceipt}
                                        amountToPay={Number(tfData?.tFee?.departmentalFee).toFixed(2)}
                                        type={'departmental'}
                                        title='Departmental Payment'
                                        isScholarshipStart={isScholarshipStart}
                                      />
                                    ) : (
                                      ''
                                    )}
                                  </TableCell>
                                )}
                              </TableRow>
                              {(!srData?.insurancePayment || insurancePaidInThisSemester) && (
                                <TableRow>
                                  <TableCell className={`px-4 py-2 ${(showPaymentOfFullPayment || insurancePaidInThisSemester || srData?.insurancePayment || showPaymentOfInsurance) && 'text-green-400 line-through'}`}>Insurance Fee</TableCell>
                                  <TableCell className={`px-4 py-2 ${(showPaymentOfFullPayment || insurancePaidInThisSemester || srData?.insurancePayment || showPaymentOfInsurance) && 'text-green-400 line-through'}`}>
                                    ₱{Number(tfData?.tFee?.insuranceFee).toFixed(2)}
                                  </TableCell>
                                  <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfFullPayment || srData?.insurancePayment || insurancePaidInThisSemester || showPaymentOfInsurance ? 'text-green-400' : 'text-red'}`}>
                                    {showPaymentOfFullPayment || srData?.insurancePayment || insurancePaidInThisSemester || showPaymentOfInsurance ? 'Paid' : 'unpaid'}
                                  </TableCell>
                                  {(!data?.enrollment?.profileId?.scholarshipId?.amount || (data?.enrollment?.profileId?.scholarshipId?.amount && Number(balanceGrant) === 0)) && (
                                    <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfFullPayment || srData?.insurancePayment || insurancePaidInThisSemester || showPaymentOfInsurance ? 'text-green-400' : 'text-red'}`}>
                                      {showPaymentOfFullPayment || srData?.insurancePayment || insurancePaidInThisSemester || showPaymentOfInsurance ? (
                                        'Completed'
                                      ) : showPaymentOfDownPayment ? (
                                        <SettleTermPayment
                                          enrollment={data?.enrollment}
                                          tfData={tfData?.tFee}
                                          srData={srData?.studentReceipt}
                                          amountToPay={Number(tfData?.tFee?.insuranceFee).toFixed(2)}
                                          type={'insurance'}
                                          title='Insurance Payment'
                                          isScholarshipStart={isScholarshipStart}
                                        />
                                      ) : (
                                        ''
                                      )}
                                    </TableCell>
                                  )}
                                </TableRow>
                              )}
                              {(!srData?.ssgPayment || ssgPaidInThisSemester) && (
                                <TableRow>
                                  <TableCell className={`px-4 py-2 ${(showPaymentOfFullPayment || ssgPaidInThisSemester || srData?.ssgPayment || showPaymentOfSSG) && 'text-green-400 line-through'}`}>SSG Fee</TableCell>
                                  <TableCell className={`px-4 py-2 ${(showPaymentOfFullPayment || ssgPaidInThisSemester || srData?.ssgPayment || showPaymentOfSSG) && 'text-green-400 line-through'}`}>₱{Number(tfData?.tFee?.ssgFee).toFixed(2)}</TableCell>
                                  <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfFullPayment || ssgPaidInThisSemester || srData?.ssgPayment || showPaymentOfSSG ? 'text-green-400' : 'text-red'}`}>
                                    {srData?.ssgPayment || ssgPaidInThisSemester || showPaymentOfFullPayment || showPaymentOfSSG ? 'Paid' : 'unpaid'}
                                  </TableCell>
                                  {(!data?.enrollment?.profileId?.scholarshipId?.amount || (data?.enrollment?.profileId?.scholarshipId?.amount && Number(balanceGrant) === 0)) && (
                                    <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfFullPayment || ssgPaidInThisSemester || srData?.ssgPayment || showPaymentOfSSG ? 'text-green-400' : 'text-red'}`}>
                                      {showPaymentOfFullPayment || ssgPaidInThisSemester || srData?.ssgPayment || showPaymentOfSSG ? (
                                        'Completed'
                                      ) : showPaymentOfDownPayment ? (
                                        <SettleTermPayment
                                          enrollment={data?.enrollment}
                                          tfData={tfData?.tFee}
                                          srData={srData?.studentReceipt}
                                          amountToPay={Number(tfData?.tFee?.ssgFee).toFixed(2)}
                                          type={'ssg'}
                                          title='SSG Payment'
                                          isScholarshipStart={isScholarshipStart}
                                        />
                                      ) : (
                                        ''
                                      )}
                                    </TableCell>
                                  )}
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                          <div className='grid grid-cols-1 sm:px-8 px-5'>
                            <div className='flex justify-between'>
                              <span className='font-medium'>Total</span>
                              <span>₱{Number(additionalTotal).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className=''>
                        <div className='grid grid-cols-1 sm:px-32 px-5'>
                          <Table className='table-auto border-collapse rounded-t-lg border '>
                            <TableHeader>
                              <TableRow className=' border-black rounded-t-lg bg-gray-200 font-bold text-[16px]'>
                                <TableHead className='px-4 py-2 text-left'>Payments Type</TableHead>
                                <TableHead className='px-4 py-2 text-left'>Amount</TableHead>
                                <TableHead className='px-4 py-2 text-left'>Status</TableHead>
                                {(!data?.enrollment?.profileId?.scholarshipId?.amount || (data?.enrollment?.profileId?.scholarshipId?.amount && Number(balanceGrant) === 0)) && <TableHead className='px-4 py-2 text-left'>Settle Payment</TableHead>}
                                <TableHead className='px-4 py-2 text-left'>Advanced</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {!showPaymentOfFullPayment && (
                                <>
                                  <TableRow>
                                    <TableCell className={`px-4 py-2 ${showPaymentOfPrelim && 'text-green-400 line-through'}`}>Prelim</TableCell>
                                    <TableCell className={`px-4 py-2 ${showPaymentOfPrelim && 'text-green-400 line-through'}`}>₱{Number(paymentPerTerm).toFixed(2)}</TableCell>
                                    <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfPrelim ? 'text-green-400 line-through' : 'text-red'}`}>{showPaymentOfPrelim ? 'Paid' : 'unpaid'}</TableCell>
                                    {(!data?.enrollment?.profileId?.scholarshipId?.amount || (data?.enrollment?.profileId?.scholarshipId?.amount && Number(balanceGrant) === 0)) && (
                                      <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfPrelim ? 'text-green-400' : 'text-red'}`}>
                                        {showPaymentOfPrelim ? (
                                          'Completed'
                                        ) : requiredPaymentsFulfill ? (
                                          <SettleTermPayment
                                            enrollment={data?.enrollment}
                                            tfData={tfData?.tFee}
                                            srData={srData?.studentReceipt}
                                            amountToPay={Number(paymentPerTerm - paymentOfPrelim).toFixed(2)}
                                            type={'prelim'}
                                            title='Prelim Payment'
                                            isScholarshipStart={isScholarshipStart}
                                          />
                                        ) : (
                                          'Not Available'
                                        )}
                                      </TableCell>
                                    )}

                                    <TableCell className={`px-4 py-2`}>{a && `₱${paymentOfPrelim.toFixed(2)}`}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className={`px-4 py-2 ${showPaymentOfMidterm && 'text-green-400 line-through'}`}>Midterm</TableCell>
                                    <TableCell className={`px-4 py-2 ${showPaymentOfMidterm && 'text-green-400 line-through'}`}>₱{Number(paymentPerTerm).toFixed(2)}</TableCell>
                                    <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfMidterm ? 'text-green-400 ' : 'text-red'}`}>{showPaymentOfMidterm ? 'Paid' : 'unpaid'}</TableCell>
                                    {(!data?.enrollment?.profileId?.scholarshipId?.amount || (data?.enrollment?.profileId?.scholarshipId?.amount && Number(balanceGrant) === 0)) && (
                                      <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfMidterm ? 'text-green-400' : 'text-red'}`}>
                                        {showPaymentOfMidterm ? (
                                          'Completed'
                                        ) : requiredPaymentsFulfill && showPaymentOfPrelim ? (
                                          <SettleTermPayment
                                            enrollment={data?.enrollment}
                                            tfData={tfData?.tFee}
                                            srData={srData?.studentReceipt}
                                            amountToPay={Number(paymentPerTerm - paymentOfMidterm).toFixed(2)}
                                            type={'midterm'}
                                            title='Midterm Payment'
                                            isScholarshipStart={isScholarshipStart}
                                          />
                                        ) : (
                                          'Not Available'
                                        )}
                                      </TableCell>
                                    )}

                                    <TableCell className={`px-4 py-2`}>{b && `₱${paymentOfMidterm.toFixed(2)}`}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className={`px-4 py-2 ${showPaymentOfSemiFinal && 'text-green-400 line-through'}`}>Semi-final</TableCell>
                                    <TableCell className={`px-4 py-2 ${showPaymentOfSemiFinal && 'text-green-400 line-through'}`}>₱{Number(paymentPerTerm).toFixed(2)}</TableCell>
                                    <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfSemiFinal ? 'text-green-400' : 'text-red'}`}>{showPaymentOfSemiFinal ? 'Paid' : 'unpaid'}</TableCell>
                                    {(!data?.enrollment?.profileId?.scholarshipId?.amount || (data?.enrollment?.profileId?.scholarshipId?.amount && Number(balanceGrant) === 0)) && (
                                      <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfSemiFinal ? 'text-green-400' : 'text-red'}`}>
                                        {showPaymentOfSemiFinal ? (
                                          'Completed'
                                        ) : requiredPaymentsFulfill && showPaymentOfPrelim && showPaymentOfMidterm ? (
                                          <SettleTermPayment
                                            enrollment={data?.enrollment}
                                            tfData={tfData?.tFee}
                                            srData={srData?.studentReceipt}
                                            amountToPay={Number(paymentPerTerm - paymentOfSemiFinal).toFixed(2)}
                                            type={'semi-final'}
                                            title='Semi-Final Payment'
                                            isScholarshipStart={isScholarshipStart}
                                          />
                                        ) : (
                                          'Not Available'
                                        )}
                                      </TableCell>
                                    )}

                                    <TableCell className={`px-4 py-2`}>{c && `₱${paymentOfSemiFinal.toFixed(2)}`}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className={`px-4 py-2 ${showPaymentOfFinal && 'text-green-400 line-through'}`}>Final</TableCell>
                                    <TableCell className={`px-4 py-2 ${showPaymentOfFinal && 'text-green-400 line-through'}`}>₱{final.toFixed(2)}</TableCell>
                                    <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfFinal ? 'text-green-400 ' : 'text-red'}`}>{showPaymentOfFinal ? 'Paid' : 'unpaid'}</TableCell>
                                    {(!data?.enrollment?.profileId?.scholarshipId?.amount || (data?.enrollment?.profileId?.scholarshipId?.amount && Number(balanceGrant) === 0)) && (
                                      <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfFinal ? 'text-green-400' : 'text-red'}`}>
                                        {showPaymentOfFinal ? (
                                          'Completed'
                                        ) : requiredPaymentsFulfill && showPaymentOfPrelim && showPaymentOfMidterm && showPaymentOfSemiFinal ? (
                                          <SettleTermPayment
                                            enrollment={data?.enrollment}
                                            tfData={tfData?.tFee}
                                            srData={srData?.studentReceipt}
                                            amountToPay={Number(final - paymentOfFinal).toFixed(2)}
                                            type={'final'}
                                            title='Final Payment'
                                            isScholarshipStart={isScholarshipStart}
                                          />
                                        ) : (
                                          'Not Available'
                                        )}
                                      </TableCell>
                                    )}

                                    <TableCell className={`px-4 py-2`}>{d && `₱${paymentOfFinal.toFixed(2)}`}</TableCell>
                                  </TableRow>
                                </>
                              )}
                              {showPaymentOfFullPayment && (
                                <>
                                  <TableRow>
                                    <TableCell className={`px-4 py-2 text-green-400 line-through`}>Prelim</TableCell>
                                    <TableCell className={`px-4 py-2 text-green-400 line-through`}>₱{Number(paymentPerTerm).toFixed(2)}</TableCell>
                                    <TableCell className={`px-4 py-2 uppercase font-semibold text-green-400 `}>Paid</TableCell>
                                    <TableCell className={`px-4 py-2 uppercase font-semibold text-green-400`}>Completed</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className={`px-4 py-2 text-green-400 line-through`}>Midterm</TableCell>
                                    <TableCell className={`px-4 py-2 text-green-400 line-through`}>₱{Number(paymentPerTerm).toFixed(2)}</TableCell>
                                    <TableCell className={`px-4 py-2 uppercase font-semibold text-green-400 `}>Paid</TableCell>
                                    <TableCell className={`px-4 py-2 uppercase font-semibold text-green-400`}>Completed</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className={`px-4 py-2 text-green-400 line-through`}>Semi-final</TableCell>
                                    <TableCell className={`px-4 py-2 text-green-400 line-through`}>₱{Number(paymentPerTerm).toFixed(2)}</TableCell>
                                    <TableCell className={`px-4 py-2 uppercase font-semibold text-green-400 `}>Paid</TableCell>
                                    <TableCell className={`px-4 py-2 uppercase font-semibold text-green-400`}>Completed</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className={`px-4 py-2 text-green-400 line-through`}>Final</TableCell>
                                    <TableCell className={`px-4 py-2 text-green-400 line-through`}>₱{(((total - tfData?.tFee?.downPayment - 3 * paymentPerTerm) * 100) / 100).toFixed(2)}</TableCell>
                                    <TableCell className={`px-4 py-2 uppercase font-semibold text-green-400 `}>Paid</TableCell>
                                    <TableCell className={`px-4 py-2 uppercase font-semibold text-green-400`}>Completed</TableCell>
                                  </TableRow>
                                </>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                        <div className='grid grid-cols-1 sm:px-36 px-5'>
                          <div className='flex justify-between'>
                            <span className='font-medium'>Total</span>
                            <span>₱{Number(totalWithoutDownPayment).toFixed(2) || (0).toFixed(2)}</span>
                          </div>
                        </div>
                        <div className='grid grid-cols-1 sm:px-40 px-8'>
                          <div className='flex justify-between'>
                            <span className='font-medium'>Balance</span>
                            <span>₱{Number(showBalance).toFixed(2) || (0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className=''></CardFooter>
                  </Card>
                </div>
              ) : (
                <>
                  {data?.enrollment?.enrollStatus.toLowerCase() === 'withdraw' && (
                    <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
                      <Card className={`min-h-[35vh] my-[10%] shadow-none drop-shadow-none items-center justify-center flex border-0`}>
                        <CardHeader className='space-y-3 hidden'>
                          <CardTitle className=''>
                            <div className='flex flex-col justify-center gap-y-1 items-center'>
                              <div className='text-center lg:text-left font-poppins'>e2e2a</div>
                            </div>
                          </CardTitle>
                          <CardDescription>e2e2a</CardDescription>
                        </CardHeader>
                        <CardContent className='flex w-full justify-center py-5 flex-col rounded-lg shadow-sm bg-white items-center border focus-visible:ring-0 space-y-5 px-0 mt-7'>
                          <div className='flex flex-col justify-center gap-y-1 py-10 items-center'>
                            <div className=''>
                              <Image src={'/images/logo1.png'} className='w-auto rounded-full' priority width={100} height={100} alt='nothing to say' />
                            </div>
                            <div className='text-center text-xl sm:text-2xl font-semibold tracking-tight uppercase'>Enrollment has been Withdraw</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  {!tfData?.tFee && data?.enrollment?.enrollStatus.toLowerCase() !== 'withdraw' && (
                    <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
                      <Card className={`min-h-[35vh] my-[10%] shadow-none drop-shadow-none items-center justify-center flex border-0`}>
                        <CardHeader className='space-y-3 hidden'>
                          <CardTitle className=''>
                            <div className='flex flex-col justify-center gap-y-1 items-center'>
                              <div className=''>
                                <Image src={'/images/logo1.png'} className='w-auto rounded-full' priority width={65} height={65} alt='nothing to say' />
                              </div>
                              <div className='text-center lg:text-left font-poppins'>No Payment Recorded Yet.</div>
                            </div>
                          </CardTitle>
                          <CardDescription>.</CardDescription>
                        </CardHeader>
                        <CardContent className='flex w-full justify-center py-5 flex-col rounded-lg shadow-sm bg-white items-center border focus-visible:ring-0 space-y-5 px-0 mt-7'>
                          <div className='flex flex-col justify-center gap-y-1 items-center'>
                            <div className=''>
                              <Image src={'/images/logo1.png'} className='w-auto rounded-full' priority width={100} height={100} alt='nothing to say' />
                            </div>
                            <div className='text-center text-xl sm:text-2xl font-semibold tracking-tight'>No Payment Recorded Yet.</div>
                          </div>
                          <span className='text-left sm:text-center w-full px-5 text-[16px]'>
                            The payment for this course has not been processed yet. The cashier is currently handling your transaction, and it will be updated soon. Please be patient, as this process does not take long.
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  {data && data.enrollment.step < 5 && (
                    <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
                      <Card className={`min-h-[35vh] my-[10%] shadow-none drop-shadow-none items-center justify-center flex border-0`}>
                        <CardHeader className='space-y-3 hidden'>
                          <CardTitle className=''>
                            <div className='text-center lg:text-left font-poppins'>e2e2a</div>
                          </CardTitle>
                          <CardDescription>e2e2a</CardDescription>
                        </CardHeader>
                        <CardContent className='flex w-full justify-center py-5 flex-col rounded-lg shadow-sm bg-white items-center border focus-visible:ring-0 space-y-5 px-0 mt-7'>
                          <div className='flex flex-col justify-center gap-y-1 items-center'>
                            <div className=''>
                              <Image src={'/images/logo1.png'} className='w-auto rounded-full' priority width={100} height={100} alt='nothing to say' />
                            </div>
                            <div className='text-center text-xl sm:text-2xl font-semibold tracking-tight'>Enrollment Record Found, but You Have Not Reached Step 5 Yet.</div>
                          </div>
                          <span className='text-left sm:text-center w-full px-5 text-[16px]'>
                            Your enrollment has been successfully recorded, but you have not yet reached Step 5 of the enrollment process. Please note that access to payment details will only be available once you complete all the required steps up to Step 5.
                            To continue your enrollment, please proceed to the next steps.
                          </span>
                          <Link href={'/enrollment'} className='hover:underline hover:text-blue-600 text-blue-500 space-y-2'>
                            <Button size={'sm'} type='button' className='w-auto flex gap-2'>
                              View Your Enrollment Here 👉
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
              <Card className={`min-h-[35vh] my-[10%] shadow-none drop-shadow-none items-center justify-center flex border-0`}>
                <CardHeader className='space-y-3 hidden'>
                  <CardTitle className=''>
                    <div className='text-center lg:text-left font-poppins'>e2e2a</div>
                  </CardTitle>
                  <CardDescription>e2e2a</CardDescription>
                </CardHeader>
                <CardContent className='flex w-full justify-center py-5 flex-col rounded-lg shadow-sm bg-white items-center border focus-visible:ring-0 space-y-5 px-0 mt-7'>
                  <div className='flex flex-col justify-center gap-y-1 items-center'>
                    <div className=''>
                      <Image src={'/images/logo1.png'} className='w-auto rounded-full' priority width={100} height={100} alt='nothing to say' />
                    </div>
                    <div className='text-center text-xl sm:text-2xl font-semibold tracking-tight'>No Enrollment has been Found.</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Page;
