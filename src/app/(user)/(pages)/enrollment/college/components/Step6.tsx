'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Icons } from '@/components/shared/Icons';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import LoaderPage from '@/components/shared/LoaderPage';

type IProps = {
  enrollment: any;
};
const Step6 = ({ enrollment }: IProps) => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { data: s } = useSession();
  useEffect(() => {
    if (!enrollment) return;
    if (enrollment) return setIsPageLoading(false);

    console.log('me and you');
  }, [enrollment]);
  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <TabsContent value='6' className='p-5 focus-visible:ring-0 border-0 '>
          <Card className={`min-h-[35vh] shadow-none drop-shadow-none items-center justify-center flex border-0`}>
            <CardHeader className='space-y-3 hidden'>
              <CardTitle className=' hidden'>Waiting for Approval!</CardTitle>
              <CardDescription className='text-center hidden'></CardDescription>
            </CardHeader>
            <CardContent className='flex w-full justify-center flex-col items-center border-[0.5px] rounded-lg shadow-sm bg-white focus-visible:ring-0 space-y-5 px-0 mx-0'>
              <div className='w-full flex flex-col items-center justify-center h-full'>
                <div className=' mt-3'>
                  <h1 className='text-center text-xl sm:text-3xl font-semibold text-black'>FINALIZED STUDENT ENROLLMENT</h1>
                </div>
                <div className='w-full flex justify-center items-center md:mt-4 md:mb-0'>
                  <Icons.hourglass className='md:h-14 fill-gray-100 md:w-14 h-10 w-10 my-3 stroke-green-400 animate-spin' style={{ animationDuration: '6s' }} />
                </div>
                {/* <h1 className='text-center text-xl sm:text-3xl font-bold font-poppins text-green-400'>Student Payment!</h1> */}
                <span className='text-sm text-left sm:mt-10 mt-5 w-full px-5 sm:px-10'>
                  Dear{' '}
                  <span className='font-semibold capitalize'>
                    <span className='capitalize'>{enrollment.profileId.firstname} </span>
                    <span className='capitalize'>{enrollment.profileId.lastname}</span>
                  </span>
                  ,
                </span>
                <span className='text-sm text-left mt-4 px-5 sm:px-10 w-full'>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is from the administrator of DCIT. Your enrollment is in the final stage. The administrator will now review and finalize your enrollment, making it officially confirmed. Once this step is completed,
                  you will be fully enrolled. If you have any questions or need further assistance, please read our docs; documentation is available at{' '}
                  <a href='/documentation' className='text-blue-600 underline'>
                    this link
                  </a>
                  .
                </span>
              </div>
              {/* <div className='my-10'>
                <div className='flex w-full items-center justify-center'>
                  <Link href='/schedules' className='bg-blue-600 text-neutral-50 hover:bg-blue-700 flex px-2 items-center py-2 text-xs sm:text-sm rounded-md'>
                    <Icons.eye className='h-5 w-5' />
                    Add/Drop Subjects
                  </Link>
                </div>
              </div> */}
              <div className='flex flex-col w-full '>
                <span className='text-left sm:text-center w-full px-5 sm:px-10 mt-5 sm:mt-10 text-sm text-muted-foreground'>
                  <span className=' relative sm:hidden'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  This action cannot be cancelled while its being on process, this will only be undone by the administrator. For further information, please visit our support team at{' '}
                  <a href='/support' className='text-blue-600 underline'>
                    this link
                  </a>
                  , or check out our FAQ section for common inquiries, if you want to stop enrolling please contact us{' '}
                  <Link href={''} className='hover:underline hover:text-blue-600 text-blue-500'>
                    e2e2a@mondrey.dev{' '}
                  </Link>
                  or visit our office for assistance.
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </>
  );
};

export default Step6;
