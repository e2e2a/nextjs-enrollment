'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LoaderPage from '@/components/shared/LoaderPage';
import { useSession } from 'next-auth/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import SettleTermPayment from './components/SettleTermPayment';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { exportToPDF } from './components/ExportUtils';
import { Icons } from '@/components/shared/Icons';
import { GeneratePDF } from './components/GeneratePDF';
import { isScholarshipApplicable } from '@/constant/scholarship';
import { useEnrollmentRecordQueryById } from '@/lib/queries/enrollmentRecord/get/id';
import { useCourseFeeRecordQueryByCourseCodeAndYearAndSemester } from '@/lib/queries/courseFeeRecord/get/courseCode';
import { useStudentReceiptQueryByUserIdAndYearAndSemester } from '@/lib/queries/studentReceipt/get/yearAndSemester';

const Page = ({ params }: { params: { id: string } }) => {
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0.0);
  const [additionalTotal, setAdditionalTotal] = useState<number>(0.0);
  const [showBalance, setShowBalance] = useState<number>(0.0);
  const [paymentPerTerm, setPaymentPerTerm] = useState<number>(0.0);
  const [labTotal, setLabTotal] = useState<number>(0.0);
  const [lecTotal, setLecTotal] = useState<number>(0.0); // consider in the tuition fee
  const [regMiscTotal, setRegMiscTotal] = useState<number>(0.0);
  const [showCwtsOrNstp, setShowCwtsOrNstp] = useState<boolean>(false);

  const { data: session } = useSession();
  const { data, error } = useEnrollmentRecordQueryById(params.id);
  const { data: tfData, error: isTFError } = useCourseFeeRecordQueryByCourseCodeAndYearAndSemester(data?.enrollmentRecord?.studentYear, data?.enrollmentRecord?.studentSemester, data?.enrollmentRecord?.courseCode || 'e2e2a');
  const { data: srData, error: srError } = useStudentReceiptQueryByUserIdAndYearAndSemester(session?.user.id as string, data?.enrollmentRecord?.studentYear, data?.enrollmentRecord?.studentSemester, data?.enrollmentRecord?.schoolYear);

  //full payment exclude all terms payment and downpayment
  const paymentOfFullPayment = srData?.studentReceipt.find((r: any) => r.type.toLowerCase() === 'fullpayment');

  let showPaymentOfFullPayment = false;
  showPaymentOfFullPayment = paymentOfFullPayment && Math.round((Number(paymentOfFullPayment?.taxes?.amount) + Number(total) * 0.1) * 100) / 100 === Math.round(Number(total) * 100) / 100;
  const scholarship = isScholarshipApplicable(data?.enrollmentRecord?.studentYear, data?.enrollmentRecord?.studentSemester, data?.enrollmentRecord?.profileId?.scholarshipId);
  const isScholarshipStart = scholarship && data?.enrollmentRecord?.profileId?.scholarshipId && data?.enrollmentRecord?.profileId?.scholarshipId;
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
  const showPaymentOfPrelim = paymentOfPrelim && (Number(paymentOfPrelim) - Number(paymentPerTerm)).toFixed(2) >= (0).toFixed(2);

  // Midterm Payment
  const paymentOfMidterm = srData?.studentReceipt
    ?.filter((r: any) => r.type.toLowerCase() === 'midterm')
    ?.reduce((total: number, payment: any) => {
      return total + (Number(payment?.taxes?.amount) || 0);
    }, 0);
  const b = Number(paymentOfMidterm) > 0 && Number(paymentOfMidterm) !== Number(paymentPerTerm);
  const showPaymentOfMidterm = paymentOfMidterm && (Number(paymentOfMidterm) - Number(paymentPerTerm)).toFixed(2) >= (0).toFixed(2);

  // Semi-final Payment
  const paymentOfSemiFinal = srData?.studentReceipt
    ?.filter((r: any) => r.type.toLowerCase() === 'semi-final')
    ?.reduce((total: number, payment: any) => {
      return total + (Number(payment?.taxes?.amount) || 0);
    }, 0);
  const c = Number(paymentOfSemiFinal) > 0 && Number(paymentOfSemiFinal) !== Number(paymentPerTerm);
  const showPaymentOfSemiFinal = paymentOfSemiFinal && (Number(paymentOfSemiFinal) - Number(paymentPerTerm)).toFixed(2) >= (0).toFixed(2);

  // Final Payment
  const paymentOfFinal = srData?.studentReceipt
    ?.filter((r: any) => r.type.toLowerCase() === 'final')
    ?.reduce((total: number, payment: any) => {
      return total + (Number(payment?.taxes?.amount) || 0);
    }, 0);
  const final = parseFloat((total - tfData?.tFee?.downPayment - 3 * paymentPerTerm).toFixed(2));
  const d = Number(paymentOfFinal) > 0 && Number(paymentOfFinal) !== Number(final);
  const showPaymentOfFinal = paymentOfFinal && (Number(paymentOfFinal) - Number(final)).toFixed(2) >= (0).toFixed(2);

  // Departmental Payment
  // only to show and hide if he paid in this schoolYear
  const paymentOfDepartmental = srData?.studentReceipt
    ?.filter((r: any) => r.type.toLowerCase() === 'departmental' && r.schoolYear === data?.enrollmentRecord?.schoolYear)
    ?.reduce((total: number, payment: any) => {
      return total + (Number(payment?.taxes?.amount) || 0);
    }, 0);
  const showPaymentOfDepartmental = paymentOfDepartmental && (Number(paymentOfDepartmental) - Number(tfData?.tFee?.departmentalFee)).toFixed(2) >= (0).toFixed(2);

  // SSG Payment
  // only to show and hide if he paid in this schoolYear
  const paymentOfSSG = srData?.studentReceipt
    ?.filter((r: any) => r.type.toLowerCase() === 'ssg' && r.schoolYear === data?.enrollmentRecord?.schoolYear)
    ?.reduce((total: number, payment: any) => {
      return total + (Number(payment?.taxes?.amount) || 0);
    }, 0);
  const showPaymentOfSSG = paymentOfSSG && (Number(paymentOfSSG) - Number(tfData?.tFee?.ssgFee)).toFixed(2) >= (0).toFixed(2);

  useEffect(() => {
    if (!showPaymentOfFullPayment) {
      const totalBalance = Number(total); // Total amount to be paid
      const paidAmount = Number(paymentOfDownPayment?.taxes?.amount || 0) + Number(paymentOfPrelim || 0) + Number(paymentOfMidterm || 0) + Number(paymentOfSemiFinal || 0) + Number(paymentOfFinal || 0);

      const remainingBalance = Math.round((totalBalance - paidAmount) * 100) / 100;
      setShowBalance(remainingBalance);
    } else {
      let a = Math.round((Number(paymentOfFullPayment?.taxes?.amount) + Number(total) * 0.1) * 100) / 100 - Math.round(Number(total) * 100) / 100;
      if (isScholarshipStart && data?.enrollmentRecord?.profileId?.scholarshipId?.discountPercentage) a = Math.round(Number(paymentOfFullPayment?.taxes?.amount) * 100) / 100 - Math.round(Number(total) * 100) / 100;
      setShowBalance(a);
    }
  }, [total, paymentOfFullPayment, showPaymentOfFullPayment, paymentOfDownPayment, paymentOfPrelim, paymentOfMidterm, paymentOfSemiFinal, paymentOfFinal, showBalance, data, isScholarshipStart]);

  useEffect(() => {
    if (isTFError || !tfData) return;
    if (error || !data) return;
    if (srError || !srData) return;

    if (tfData && data) {
      if (data?.enrollmentRecord && tfData.tFee) {
        setLabTotal(0);
        setLecTotal(0);
        setRegMiscTotal(0);
        setTotal(0);
        const lab = data.enrollmentRecord.studentSubjects.reduce((acc: number, subjects: any) => acc + Number(subjects?.subject?.lab), 0);
        const lec = data.enrollmentRecord.studentSubjects.reduce((acc: number, subjects: any) => acc + Number(subjects?.subject?.lec), 0);
        let addcwtsOrNstpFee = false;
        const cwtsOrNstpFee = Number(tfData?.tFee?.cwtsOrNstpFee) || 0;

        // Ensure correct calculations at every step
        const aFormatted = parseFloat((lab * tfData?.tFee?.ratePerLab).toFixed(2));
        const bFormatted = parseFloat((lec * tfData?.tFee?.ratePerUnit).toFixed(2));
        const cFormatted = parseFloat(tfData?.tFee?.regOrMisc.reduce((acc: number, tFee: any) => acc + Number(tFee.amount), 0).toFixed(2));
        const dFormatted = Number(tfData?.tFee?.downPayment || 0);
        const a = bFormatted + dFormatted;
        const d = data.enrollmentRecord.studentSubjects.find((sub: any) => {
          if (
            sub?.subject.subjectCode.trim().toLowerCase() === 'cwts' ||
            sub?.subject.subjectCode.trim().toLowerCase() === 'nstp' ||
            sub?.subject.subjectCode.trim().toLowerCase() === 'nstp1' ||
            sub?.subject.subjectCode.trim().toLowerCase() === 'nstp2' ||
            sub?.subject.subjectCode.trim().toLowerCase() === 'cwts1' ||
            sub?.subject.subjectCode.trim().toLowerCase() === 'cwts2'
          ) {
            setShowCwtsOrNstp(true);
            addcwtsOrNstpFee = true;
            return true;
          }
          return false;
        });

        setLabTotal(aFormatted);
        let LecTotal = aFormatted;
        setLecTotal(a);
        if (isScholarshipStart && data?.enrollmentRecord?.profileId?.scholarshipId?.exemptedFees.includes('Tuition Fee')) {
          if (data?.enrollmentRecord?.profileId?.scholarshipId?.type === 'percentage') {
            const b = parseFloat((a * Number(data?.enrollmentRecord?.profileId?.scholarshipId?.discountPercentage)).toFixed(2));
            const c = parseFloat((a - b).toFixed(2));
            LecTotal = c;
            setLecTotal(c);
          } else {
            // cFormatted = parseFloat((cFormatted * data?.enrollment?.profileId?.scholarshipId).toFixed(2))
          }
        }

        setRegMiscTotal(cFormatted);
        let RegMiscTotal = cFormatted;
        if (isScholarshipStart && data?.enrollmentRecord?.profileId?.scholarshipId?.exemptedFees.includes('Miscellaneous Fees')) {
          if (data?.enrollmentRecord?.profileId?.scholarshipId?.type === 'percentage') {
            const b = parseFloat((cFormatted * Number(data?.enrollmentRecord?.profileId?.scholarshipId?.discountPercentage)).toFixed(2));
            const c = parseFloat((cFormatted - b).toFixed(2));
            RegMiscTotal = c;
            setRegMiscTotal(c);
          } else {
            // cFormatted = parseFloat((cFormatted * data?.enrollment?.profileId?.scholarshipId).toFixed(2))
          }
        }
        const totalAmount = addcwtsOrNstpFee ? aFormatted + LecTotal + RegMiscTotal + cwtsOrNstpFee : aFormatted + LecTotal + RegMiscTotal;

        const formattedTotal = parseFloat(totalAmount.toFixed(2)); // Final formatting
        setTotal(formattedTotal);
        const totalWithoutDownPayment = Number(formattedTotal) - dFormatted;
        const totalPerTerm = Math.round(totalWithoutDownPayment * 100) / 100;
        const paymentPerTerm = Math.ceil((totalPerTerm / 4) * 100) / 100;

        setPaymentPerTerm(Number(paymentPerTerm));
      }
      setIsPageLoading(false);
      return;
    }
  }, [data, error, tfData, srData, srError, isTFError, isScholarshipStart]);

  useEffect(() => {
    let additionPayment = parseFloat((Number(tfData?.tFee?.ssgFee) + Number(tfData?.tFee?.departmentalFee)).toFixed(2));
    if (showPaymentOfDepartmental) additionPayment = parseFloat((additionPayment - tfData?.tFee?.ssgFee).toFixed(2));
    if (showPaymentOfSSG) additionPayment = parseFloat((additionPayment - tfData?.tFee?.departmentalFee).toFixed(2));
    setAdditionalTotal(additionPayment);
  }, [tfData, showPaymentOfSSG, showPaymentOfDepartmental]);
  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <>
          {data?.enrollmentRecord ? (
            <>
              {tfData?.tFee ? (
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
                              <CardDescription className='text-xs sm:text-sm'>Department: {tfData?.tFee?.course}</CardDescription>
                            </CardHeader>
                            <CardContent className='w-full'>
                              <div className='grid grid-cols-1 sm:px-32 px-5'>
                                <div className='flex justify-between'>
                                  <span className='font-medium'>REG/MISC</span>
                                  <span>₱{Number(regMiscTotal).toFixed(2) || (0).toFixed(2)}</span>
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
                                    <span className='font-medium'>CWTS/NSTP</span>
                                    <span>₱{Number(tfData?.tFee?.cwtsOrNstpFee).toFixed(2) || (0).toFixed(2)}</span>
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
                                  1 Year Payment <span className='flex justify-start items-start text-[15px] text-red'>(Required)</span>
                                </h1>
                                <span className='text-muted-foreground'>Note: This is only for New student and it will automatically have a payment if student still not pay or avail with this.</span>
                                <div className='grid grid-cols-1 w-full sm:px-32 px-5'>
                                  <div className='flex justify-between w-full'>
                                    <span className='font-medium'>Departmental Fee</span>
                                    <span>₱{Number(tfData?.tFee?.departmentalFee || 0).toFixed(2) || (0).toFixed(2)}</span>
                                  </div>
                                  <div className='flex justify-between'>
                                    <span className='font-medium'>SSG Fee</span>
                                    <span>₱{Number(tfData?.tFee?.ssgFee || 0).toFixed(2) || (0).toFixed(2)}</span>
                                  </div>
                                </div>
                                <div className='grid grid-cols-1 sm:px-36 w-full px-5'>
                                  <div className='flex justify-between'>
                                    <span className='font-medium'>Total</span>
                                    <span>₱{(Number(tfData?.tFee?.departmentalFee || 0) + Number(tfData?.tFee?.ssgFee || 0)).toFixed(2)}</span>
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
                          data?.enrollmentRecord,
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
                          srData?.departmentalPayment,
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
                        <span className='text-xs sm:text-sm'>Department: {tfData?.tFee?.course} </span>
                        <span className='text-xs sm:text-sm'>SchoolYear: {data?.enrollmentRecord?.schoolYear} </span>
                      </CardDescription>
                      <div className=''>
                        {!showPaymentOfFullPayment && !showPaymentOfDownPayment && !showPaymentOfPrelim && !showPaymentOfMidterm && !showPaymentOfSemiFinal && !showPaymentOfFinal && (
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
                              <SettleTermPayment
                                enrollment={data?.enrollmentRecord}
                                tfData={tfData?.tFee}
                                srData={srData?.studentReceipt}
                                amountToPay={Number(total).toFixed(2)}
                                type={'fullPayment'}
                                title='Full Payment'
                                isScholarshipStart={isScholarshipStart}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      {isScholarshipStart && (
                        <>
                          {data?.enrollmentRecord?.profileId?.scholarshipId?.discountPercentage && (
                            <div className=''>
                              <h1 className='flex flex-col gap-x-2 justify-start items-start font-semibold text-green-500'>
                                <span className='text-sm text-justify'>Discounted:{parseFloat((data?.enrollmentRecord?.profileId?.scholarshipId?.discountPercentage * 100).toFixed(0))}%</span>
                                <span className='text-sm text-justify'>Exempted:{data?.enrollmentRecord?.profileId?.scholarshipId?.exemptedFees.join(', ')}</span>
                              </h1>
                            </div>
                          )}
                        </>
                      )}
                    </CardHeader>
                    <CardContent className='w-full'>
                      <div className='grid grid-cols-1 sm:px-32 px-5'>
                        <Table className='table-auto border-collapse rounded-t-lg border '>
                          <TableHeader>
                            <TableRow className=' border-black rounded-t-lg bg-gray-200 font-bold text-[16px]'>
                              <TableHead className='px-4 py-2 text-left'>Payments Type</TableHead>
                              <TableHead className='px-4 py-2 text-left'>Amount</TableHead>
                              <TableHead className='px-4 py-2 text-left'>Status</TableHead>
                              <TableHead className='px-4 py-2 text-left'>Settle Payment</TableHead>
                              <TableHead className='px-4 py-2 text-left'>Advanced</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {!showPaymentOfFullPayment && (
                              <>
                                <TableRow>
                                  <TableCell className={`px-4 py-2 ${showPaymentOfDownPayment && 'text-green-400 line-through'}`}>Down Payment</TableCell>
                                  <TableCell className={`px-4 py-2 ${showPaymentOfDownPayment && 'text-green-400 line-through'}`}>₱{Number(tfData?.tFee?.downPayment).toFixed(2)}</TableCell>
                                  <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfDownPayment ? 'text-green-400' : 'text-red'}`}>{showPaymentOfDownPayment ? 'Paid' : 'unpaid'}</TableCell>
                                  <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfDownPayment ? 'text-green-400' : 'text-red'}`}>
                                    {showPaymentOfDownPayment ? (
                                      'Completed'
                                    ) : (
                                      <SettleTermPayment
                                        enrollment={data?.enrollmentRecord}
                                        tfData={tfData?.tFee}
                                        srData={srData?.studentReceipt}
                                        amountToPay={Number(tfData?.tFee?.downPayment).toFixed(2)}
                                        type={'downPayment'}
                                        title='Down Payment'
                                        isScholarshipStart={isScholarshipStart}
                                      />
                                    )}
                                  </TableCell>
                                  {/* <TableCell className={`px-4 py-2`}>{a > 0 && `₱${a.toFixed(2)}`}</TableCell> */}
                                </TableRow>
                                <TableRow>
                                  <TableCell className={`px-4 py-2 ${showPaymentOfPrelim && 'text-green-400 line-through'}`}>Prelim</TableCell>
                                  <TableCell className={`px-4 py-2 ${showPaymentOfPrelim && 'text-green-400 line-through'}`}>₱{Number(paymentPerTerm).toFixed(2)}</TableCell>
                                  <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfPrelim ? 'text-green-400 line-through' : 'text-red'}`}>{showPaymentOfPrelim ? 'Paid' : 'unpaid'}</TableCell>
                                  <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfPrelim ? 'text-green-400' : 'text-red'}`}>
                                    {showPaymentOfPrelim ? (
                                      'Completed'
                                    ) : showPaymentOfDownPayment ? (
                                      <SettleTermPayment
                                        enrollment={data?.enrollmentRecord}
                                        tfData={tfData?.tFee}
                                        srData={srData?.studentReceipt}
                                        amountToPay={Number(paymentPerTerm).toFixed(2)}
                                        type={'prelim'}
                                        title='Prelim Payment'
                                        isScholarshipStart={isScholarshipStart}
                                      />
                                    ) : (
                                      'Not Available'
                                    )}
                                  </TableCell>
                                  <TableCell className={`px-4 py-2`}>{a && `₱${paymentOfPrelim.toFixed(2)}`}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className={`px-4 py-2 ${showPaymentOfMidterm && 'text-green-400 line-through'}`}>Midterm</TableCell>
                                  <TableCell className={`px-4 py-2 ${showPaymentOfMidterm && 'text-green-400 line-through'}`}>₱{Number(paymentPerTerm).toFixed(2)}</TableCell>
                                  <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfMidterm ? 'text-green-400 line-through' : 'text-red'}`}>{showPaymentOfMidterm ? 'Paid' : 'unpaid'}</TableCell>
                                  <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfMidterm ? 'text-green-400' : 'text-red'}`}>
                                    {showPaymentOfMidterm ? (
                                      'Completed'
                                    ) : showPaymentOfDownPayment && showPaymentOfPrelim ? (
                                      <SettleTermPayment
                                        enrollment={data?.enrollmentRecord}
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
                                  <TableCell className={`px-4 py-2`}>{b && `₱${paymentOfMidterm.toFixed(2)}`}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className={`px-4 py-2 ${showPaymentOfSemiFinal && 'text-green-400 line-through'}`}>Semi-final</TableCell>
                                  <TableCell className={`px-4 py-2 ${showPaymentOfSemiFinal && 'text-green-400 line-through'}`}>₱{Number(paymentPerTerm).toFixed(2)}</TableCell>
                                  <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfSemiFinal ? 'text-green-400 line-through' : 'text-red'}`}>{showPaymentOfSemiFinal ? 'Paid' : 'unpaid'}</TableCell>
                                  <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfSemiFinal ? 'text-green-400' : 'text-red'}`}>
                                    {showPaymentOfSemiFinal ? (
                                      'Completed'
                                    ) : showPaymentOfDownPayment && showPaymentOfPrelim && showPaymentOfMidterm ? (
                                      <SettleTermPayment
                                        enrollment={data?.enrollmentRecord}
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
                                  <TableCell className={`px-4 py-2`}>{c && `₱${paymentOfSemiFinal.toFixed(2)}`}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className={`px-4 py-2 ${showPaymentOfFinal && 'text-green-400 line-through'}`}>Final</TableCell>
                                  <TableCell className={`px-4 py-2 ${showPaymentOfFinal && 'text-green-400 line-through'}`}>₱{final.toFixed(2)}</TableCell>
                                  <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfFinal ? 'text-green-400 line-through' : 'text-red'}`}>{showPaymentOfFinal ? 'Paid' : 'unpaid'}</TableCell>
                                  <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfFinal ? 'text-green-400' : 'text-red'}`}>
                                    {showPaymentOfFinal ? (
                                      'Completed'
                                    ) : showPaymentOfDownPayment && showPaymentOfPrelim && showPaymentOfMidterm && showPaymentOfSemiFinal ? (
                                      <SettleTermPayment
                                        enrollment={data?.enrollmentRecord}
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
                                  <TableCell className={`px-4 py-2`}>{d && `₱${paymentOfFinal.toFixed(2)}`}</TableCell>
                                </TableRow>
                              </>
                            )}
                            {showPaymentOfFullPayment && (
                              <>
                                <TableRow>
                                  <TableCell className={`px-4 py-2 text-green-400 line-through`}>Down Payment</TableCell>
                                  <TableCell className={`px-4 py-2 text-green-400 line-through`}>₱{Number(tfData?.tFee?.downPayment).toFixed(2)}</TableCell>
                                  <TableCell className={`px-4 py-2 uppercase font-semibold text-green-400`}>Paid</TableCell>
                                  <TableCell className={`px-4 py-2 uppercase font-semibold text-green-400`}>Completed</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className={`px-4 py-2 text-green-400 line-through`}>Prelim</TableCell>
                                  <TableCell className={`px-4 py-2 text-green-400 line-through`}>₱{Number(paymentPerTerm).toFixed(2)}</TableCell>
                                  <TableCell className={`px-4 py-2 uppercase font-semibold text-green-400 line-through`}>Paid</TableCell>
                                  <TableCell className={`px-4 py-2 uppercase font-semibold text-green-400`}>Completed</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className={`px-4 py-2 text-green-400 line-through`}>Midterm</TableCell>
                                  <TableCell className={`px-4 py-2 text-green-400 line-through`}>₱{Number(paymentPerTerm).toFixed(2)}</TableCell>
                                  <TableCell className={`px-4 py-2 uppercase font-semibold text-green-400 line-through`}>Paid</TableCell>
                                  <TableCell className={`px-4 py-2 uppercase font-semibold text-green-400`}>Completed</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className={`px-4 py-2 text-green-400 line-through`}>Semi-final</TableCell>
                                  <TableCell className={`px-4 py-2 text-green-400 line-through`}>₱{Number(paymentPerTerm).toFixed(2)}</TableCell>
                                  <TableCell className={`px-4 py-2 uppercase font-semibold text-green-400 line-through`}>Paid</TableCell>
                                  <TableCell className={`px-4 py-2 uppercase font-semibold text-green-400`}>Completed</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className={`px-4 py-2 text-green-400 line-through`}>Final</TableCell>
                                  <TableCell className={`px-4 py-2 text-green-400 line-through`}>₱{(((total - tfData?.tFee?.downPayment - 3 * paymentPerTerm) * 100) / 100).toFixed(2)}</TableCell>
                                  <TableCell className={`px-4 py-2 uppercase font-semibold text-green-400 line-through`}>Paid</TableCell>
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
                          <span>₱{Number(total).toFixed(2) || (0).toFixed(2)}</span>
                        </div>
                      </div>
                      <div className='grid grid-cols-1 sm:px-40 px-8'>
                        <div className='flex justify-between'>
                          <span className='font-medium'>Balance</span>
                          <span>₱{Number(showBalance).toFixed(2) || (0).toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className=''></CardFooter>
                  </Card>
                  {/* Departmental and ssg Fee */}
                  {(!srData?.departmentalPayment || !srData?.ssgPayment) && (
                    <Card className='border-0 py-5 bg-transparent'>
                      <CardHeader className='space-y-3'>
                        <CardTitle className='text-lg md:text-xl tracking-tight w-full text-left font-semibold uppercase'>
                          Additional Fees <span className='text-red'>(REQUIRED)</span>
                        </CardTitle>
                        <CardDescription className='text-xs sm:text-sm flex'>
                          <span className='text-xs sm:text-sm'>Note: This Payment will only be available for 1Year payment. </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className='w-full'>
                        <div className='grid grid-cols-1 sm:px-32 px-5'>
                          <Table className='table-auto border-collapse rounded-t-lg border '>
                            <TableHeader>
                              <TableRow className=' border-black rounded-t-lg bg-gray-200 font-bold text-[16px]'>
                                <TableHead className='px-4 py-2 text-left'>Payments Type</TableHead>
                                <TableHead className='px-4 py-2 text-left'>Amount</TableHead>
                                <TableHead className='px-4 py-2 text-left'>Status</TableHead>
                                <TableHead className='px-4 py-2 text-left'>Settle Payment</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className={`px-4 py-2 ${(srData?.departmentalPayment || showPaymentOfDepartmental) && 'text-green-400 line-through'}`}>Departmental Fee</TableCell>
                                <TableCell className={`px-4 py-2 ${(srData?.departmentalPayment || showPaymentOfDepartmental) && 'text-green-400 line-through'}`}>₱{Number(tfData?.tFee?.departmentalFee).toFixed(2)}</TableCell>
                                <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfDepartmental || srData?.departmentalPayment ? 'text-green-400' : 'text-red'}`}>
                                  {showPaymentOfDepartmental || srData?.departmentalPayment ? 'Paid' : 'unpaid'}
                                </TableCell>
                                <TableCell className={`px-4 py-2 uppercase font-semibold ${showPaymentOfDepartmental || srData?.departmentalPayment ? 'text-green-400' : 'text-red'}`}>
                                  {srData?.departmentalPayment || showPaymentOfDepartmental ? (
                                    'Completed'
                                  ) : showPaymentOfFinal || showPaymentOfDownPayment ? (
                                    <SettleTermPayment
                                      enrollment={data?.enrollmentRecord}
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
                                {/* <TableCell className={`px-4 py-2`}>{a > 0 && `₱${a.toFixed(2)}`}</TableCell> */}
                              </TableRow>
                              <TableRow>
                                <TableCell className={`px-4 py-2 ${(srData?.ssgPayment || showPaymentOfSSG) && 'text-green-400 line-through'}`}>SSG Fee</TableCell>
                                <TableCell className={`px-4 py-2 ${(srData?.ssgPayment || showPaymentOfSSG) && 'text-green-400 line-through'}`}>₱{Number(tfData?.tFee?.ssgFee).toFixed(2)}</TableCell>
                                <TableCell className={`px-4 py-2 uppercase font-semibold ${srData?.ssgPayment || showPaymentOfSSG ? 'text-green-400' : 'text-red'}`}>{srData?.ssgPayment || showPaymentOfSSG ? 'Paid' : 'unpaid'}</TableCell>
                                <TableCell className={`px-4 py-2 uppercase font-semibold ${srData?.ssgPayment || showPaymentOfSSG ? 'text-green-400' : 'text-red'}`}>
                                  {srData?.ssgPayment || showPaymentOfSSG ? (
                                    'Completed'
                                  ) : showPaymentOfFinal || showPaymentOfDownPayment ? (
                                    <SettleTermPayment
                                      enrollment={data?.enrollmentRecord}
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
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                        <div className='grid grid-cols-1 sm:px-36 px-5'>
                          <div className='flex justify-between'>
                            <span className='font-medium'>Total</span>
                            <span>₱{Number(additionalTotal).toFixed(2)}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className=''></CardFooter>
                    </Card>
                  )}
                </div>
              ) : (
                <>
                  {!tfData?.tFee && (
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
                            <div className='flex flex-col justify-center gap-y-1 items-center'>
                              <div className=''>
                                <Image src={'/images/logo1.png'} className='w-auto rounded-full' priority width={65} height={65} alt='nothing to say' />
                              </div>
                              <div className='text-center lg:text-left font-poppins'>No Enrollment Found</div>
                            </div>
                          </CardTitle>
                          <CardDescription>
                            To proceed with your enrollment, please ensure all required fields are completed. Accurate and complete information is essential for successful registration. Double-check your details before submitting to avoid any delays in
                            processing your enrollment. If you have trouble filling out any fields, please check out our documentation or contact us at <span className='text-blue-500 cursor-pointer'>+639123456789</span> for further information.
                          </CardDescription>
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
                    <div className='flex flex-col justify-center gap-y-1 items-center'>
                      <div className=''>
                        <Image src={'/images/logo1.png'} className='w-auto rounded-full' priority width={65} height={65} alt='nothing to say' />
                      </div>
                      <div className='text-center lg:text-left font-poppins'>No Enrollment Found</div>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    To proceed with your enrollment, please ensure all required fields are completed. Accurate and complete information is essential for successful registration. Double-check your details before submitting to avoid any delays in processing your
                    enrollment. If you have trouble filling out any fields, please check out our documentation or contact us at <span className='text-blue-500 cursor-pointer'>+639123456789</span> for further information.
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex w-full justify-center py-5 flex-col rounded-lg shadow-sm bg-white items-center border focus-visible:ring-0 space-y-5 px-0 mt-7'>
                  <div className='flex flex-col justify-center gap-y-1 items-center'>
                    <div className=''>
                      <Image src={'/images/logo1.png'} className='w-auto rounded-full' priority width={100} height={100} alt='nothing to say' />
                    </div>
                    <div className='text-center text-xl sm:text-2xl font-semibold tracking-tight'>No Enrollment has been Found.</div>
                  </div>
                  <span className='text-left sm:text-center w-full px-5 text-[16px]'>Explore our available courses and find the perfect fit for your academic journey. Click the link below to view detailed course offerings.</span>
                  <Link href={'/courses'} className='hover:underline hover:text-blue-600 text-blue-500 space-y-2'>
                    <Button size={'sm'} type='button' className='w-auto flex gap-2'>
                      View Available Course in Categories 👉
                    </Button>
                  </Link>
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
