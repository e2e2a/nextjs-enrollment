'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import LoaderPage from '@/components/shared/LoaderPage';
import { useCourseFeeQueryByCourseIdAndYear } from '@/lib/queries/courseFee/get/courseId';
import { useEnrollmentQueryBySessionId } from '@/lib/queries/enrollment/get/session';
import { useSession } from 'next-auth/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Page = () => {
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [regMisc, setRegMisc] = useState([]);
  const { data: s } = useSession();
  const { data: eData, error: eError } = useEnrollmentQueryBySessionId(s?.user?.id as string);
  const { data: tfData, error: isTFError } = useCourseFeeQueryByCourseIdAndYear(eData?.enrollment?.studentYear, eData?.enrollment?.courseId?._id);

  const cFormatted = parseFloat(regMisc.reduce((acc: number, tFee: any) => acc + Number(tFee.amount), 0).toFixed(2));

  useEffect(() => {
    if (isTFError || !tfData) return;
    if (eError || !eData) return;

    if (eData && tfData) {
      if (eData.enrollment && tfData.tFee) {
        if (tfData?.tFee?.regOrMiscWithOldAndNew) {
          if (eData?.enrollment?.studentStatus?.toLowerCase() === 'new student' || eData?.enrollment?.studentStatus?.toLowerCase() === 'transfer student' || eData?.enrollment?.studentStatus?.toLowerCase() === 'transferee') {
            setRegMisc(tfData?.tFee?.regOrMiscNew);
          } else {
            setRegMisc(tfData?.tFee?.regOrMisc);
          }
        } else {
          setRegMisc(tfData?.tFee?.regOrMisc);
        }
        setIsPageLoading(false);
        return;
      }
    }
  }, [eData, eError, tfData, isTFError]);

  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <div className='border-0 bg-white rounded-xl min-h-[87vh]'>
          <Card className='border-0 py-5 bg-transparent'>
            <CardHeader className='space-y-3'>
              <CardTitle className='text-lg xs:text-2xl sm:text-3xl tracking-tight w-full text-center uppercase'>Course Fee</CardTitle>
              <CardDescription className='flex justify-between text-xs sm:text-sm'>
                <span className=''>Department: {tfData?.tFee?.courseId?.name}</span>
                <span className='uppercase'>Year: {tfData?.tFee?.year}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className='w-full'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <span className='uppercase text-[16px]'>
                  <span className='font-semibold'>Rate Per Unit</span>: ₱{tfData?.tFee?.ratePerUnit}
                </span>
                <span className='uppercase text-[16px]'>
                  <span className='font-semibold'>Rate Per Lab</span>: ₱{tfData?.tFee?.ratePerLab}
                </span>
              </div>
              <div className='flex flex-col items-start w-full justify-center mt-10 mb-10'>
                <h1 className='text-lg font-semibold xs:text-xl sm:text-2xl tracking-tight w-full text-start uppercase'>
                  Additional Fees <span className='text-muted-foreground text-red'>(REQUIRED)</span>
                </h1>
                <p className='text-sm text-muted-foreground mt-2'>
                  The Departmental Fee is required each semester, the Insurance Fee once per year, and the SSG Fee only for the first two payments of an academic year. The Passbook Fee is a one-time payment but is created yearly for transferees who may still
                  need to purchase one.
                </p>
                <div className='mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full'>
                  <span className='uppercase text-[16px]'>
                    <span className='font-semibold'>Departmental Fee</span>: ₱{tfData?.tFee?.departmentalFee}
                  </span>
                  <span className='uppercase text-[16px]'>
                    <span className='font-semibold'>Insurance Fee</span>: ₱{tfData?.tFee?.insuranceFee}
                  </span>
                  <span className='uppercase text-[16px]'>
                    <span className='font-semibold'>SSG Fee</span>: ₱{tfData?.tFee?.ssgFee}
                  </span>
                </div>
              </div>
              <div className='overflow-x-auto mt-3 rounded-t-lg'>
                <div className='my-3'>
                  <h1 className='text-lg font-semibold xs:text-xl sm:text-xl tracking-tight w-full text-start uppercase'>Reg/Misc Fees</h1>
                  <p className='text-sm text-muted-foreground mt-2'>
                    Note: Downpayment is a required initial amount that the student must input during enrollment. It is not included in the total Registration and Miscellaneous Fees but will be deducted from them once paid.
                  </p>
                </div>
                <span className='uppercase text-[16px] my-5 flex'>
                  <span className='font-semibold'>Down Payment</span>: {tfData?.tFee?.downPayment}
                </span>
                <Table className='table-auto border-collapse rounded-t-lg border '>
                  <TableHeader>
                    <TableRow className=' border-black rounded-t-lg bg-gray-200 font-bold text-[16px]'>
                      <TableHead className='px-4 py-2 text-left'>Name</TableHead>
                      <TableHead className='px-4 py-2 text-left'>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {regMisc?.map((row: any, index: any) => (
                      <TableRow key={index}>
                        <TableCell className='px-4 py-2'>{row.name}</TableCell>
                        <TableCell className='px-4 py-2'>₱{Number(row?.amount).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className='px-4 py-2'>Total</TableCell>
                      <TableCell className='px-4 py-2'>₱{Number(cFormatted).toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className='overflow-x-auto mt-3 rounded-t-lg'>
                <div className='my-3'>
                  <h1 className='text-lg font-semibold xs:text-xl sm:text-xl tracking-tight w-full text-start uppercase'>Other Fees</h1>
                  <p className='text-sm text-muted-foreground mt-2'>Note: CWTS/NSTP and OJT fees are only applicable if the student is enrolled in the corresponding subject.</p>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2'>
                  <span className='uppercase text-[16px]'>
                    <span className='font-semibold'>CWTS/NSTP Fee</span>: ₱{tfData?.tFee?.cwtsOrNstpFee}
                  </span>
                  <span className='uppercase text-[16px]'>
                    <span className='font-semibold'>CWTS/NSTP Fee</span>: ₱{tfData?.tFee?.ojtFee}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className=''></CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default Page;
