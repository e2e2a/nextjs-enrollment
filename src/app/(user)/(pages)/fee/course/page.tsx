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
  const { data: s } = useSession();
  const { data: eData, error: eError } = useEnrollmentQueryBySessionId(s?.user?.id as string);
  const { data: tfData, error: isTFError } = useCourseFeeQueryByCourseIdAndYear(eData?.enrollment?.profileId?.studentYear, eData?.enrollment?.courseId?._id);

  useEffect(() => {
    if (isTFError || !tfData) return;
    if (eError || !eData) return;

    if (eData && tfData) {
      if (eData.enrollment && tfData.tFee) {
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
                  <span className='font-semibold'>year</span>: {tfData?.tFee?.year}
                </span>
                <span className='uppercase text-[16px]'>
                  <span className='font-semibold'>Rate Per Unit</span>: {tfData?.tFee?.ratePerUnit}
                </span>
                <span className='uppercase text-[16px]'>
                  <span className='font-semibold'>Rate Per Lab</span>: {tfData?.tFee?.ratePerLab}
                </span>
                <span className='uppercase text-[16px]'>
                  <span className='font-semibold'>CWTS/NSTP Fee</span>: {tfData?.tFee?.cwtsOrNstpFee}
                </span>
                <span className='uppercase text-[16px]'>
                  <span className='font-semibold'>Down Payment</span>: {tfData?.tFee?.downPayment}
                </span>
              </div>
              <div className='flex flex-col items-start w-full justify-center mt-10 mb-10'>
                <h1 className='text-lg font-semibold xs:text-xl sm:text-2xl tracking-tight w-full text-start uppercase'>
                  Additional Payment <span className='text-muted-foreground text-red'>(REQUIRED)</span>
                </h1>
                <p className='text-sm text-muted-foreground mt-2'>
                  The Departmental Fee is required every semester, while the Insurance Fee is only required once per year. The SSG Fee is required for the first two payments within a single academic year. After the first two payments, it will no longer be
                  required for the remaining semesters.
                </p>
                <div className='mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full'>
                  <span className='uppercase text-[16px]'>
                    <span className='font-semibold'>Departmental Fee</span>: {tfData?.tFee?.departmentalFee}
                  </span>
                  <span className='uppercase text-[16px]'>
                    <span className='font-semibold'>Insurance Feeyear</span>: {tfData?.tFee?.insuranceFee}
                  </span>
                  <span className='uppercase text-[16px]'>
                    <span className='font-semibold'>SSG Fee</span>: {tfData?.tFee?.ssgFee}
                  </span>
                </div>
              </div>
              <div className='overflow-x-auto mt-3 rounded-t-lg'>
                <div className='my-3'>
                  <h1 className='text-lg font-semibold xs:text-xl sm:text-xl tracking-tight w-full text-start uppercase'>Reg/Misc Fee</h1>
                </div>
                <Table className='table-auto border-collapse rounded-t-lg border '>
                  <TableHeader>
                    <TableRow className=' border-black rounded-t-lg bg-gray-200 font-bold text-[16px]'>
                      <TableHead className='px-4 py-2 text-left'>Type</TableHead>
                      <TableHead className='px-4 py-2 text-left'>Name</TableHead>
                      <TableHead className='px-4 py-2 text-left'>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tfData?.tFee?.regOrMisc.map((row: any, index: any) => (
                      <TableRow key={index}>
                        <TableCell className='px-4 py-2'>{row.type}</TableCell>
                        <TableCell className='px-4 py-2'>{row.name}</TableCell>
                        <TableCell className='px-4 py-2'>{Number(row?.amount).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
