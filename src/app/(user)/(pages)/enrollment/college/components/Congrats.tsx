'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';
import LoaderPage from '@/components/shared/LoaderPage';
import Image from 'next/image';
import WithdrawDialog from './WithdrawDialog';
import CancelWithdrawDialog from './CancelWithdrawDialog';

type IProps = {
  enrollment: any;
  enrollmentSetup: any;
};

const Congrats = ({ enrollment, enrollmentSetup }: IProps) => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    if (!enrollment) return;
    if (enrollment) return setIsPageLoading(false);
  }, [enrollment]);

  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <>
          {enrollment.enrollStatus.toLowerCase() === 'withdraw' ? (
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
          ) : (
            <TabsContent value='6' className='p-5 focus-visible:ring-0 border-0 '>
              <Card className={`min-h-[35vh] shadow-none drop-shadow-none items-center justify-center flex border-0`}>
                <CardHeader className='space-y-3 hidden'>
                  <CardTitle className=' hidden'>Waiting for Approval!</CardTitle>
                  <CardDescription className='text-center hidden'></CardDescription>
                </CardHeader>
                <CardContent className='flex w-full justify-center flex-col items-center border-[0.5px] rounded-lg shadow-sm bg-white focus-visible:ring-0 space-y-5 px-0 mx-0'>
                  <div className='w-full flex flex-col items-center justify-center h-full'>
                    {/* <div className=' mt-3'>
                  <h1 className='text-center text-xl sm:text-3xl font-semibold text-black'>asdasd</h1>
                </div> */}
                    <div className='w-full flex justify-start items-center md:mt-4 md:mb-0 px-5 sm:px-10'>
                      <div className='flex gap-x-2 xs:flex-row flex-col'>
                        <div className='w-full sm:w-auto flex justify-center'>
                          <Image src='/images/logo1.png' alt='nothing to say' width={100} height={100} className='h-36 w-36' priority />
                        </div>
                        <div className='flex flex-col sm:mt-6'>
                          <div className='uppercase font-semibold sm:text-xl xs:text-lg text-sm'>Dipolog City Institute of Technology, INC.</div>
                          <div className='uppercase font-semibold sm:text-xl xs:text-lg text-sm'>National Highway, Minaog, Dipolog City, Zamboanga del Norte</div>
                        </div>
                      </div>
                      {/* <Icons.hourglass className='md:h-14 fill-gray-100 md:w-14 h-10 w-10 my-3 stroke-green-400 animate-spin' style={{ animationDuration: '6s' }} /> */}
                    </div>
                    {/* <h1 className='text-center text-xl sm:text-3xl font-bold font-poppins text-green-400'>Student Payment!</h1> */}
                    <span className='text-sm text-left sm:mt-10 mt-5 w-full px-5 sm:px-10'>
                      Dear{' '}
                      <span className='font-semibold capitalize'>
                        <span className='capitalize'>{enrollment?.profileId?.firstname ?? ''} </span>
                        <span className='capitalize'>{enrollment?.profileId?.lastname ?? ''}</span>
                      </span>
                      ,
                    </span>
                    <span className='text-sm text-left mt-4 px-5 sm:px-10 w-full'>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Thank you for your patience throughout the enrollment process. We are pleased to confirm that you are now{' '}
                      <span className='text-green-500'> {enrollment.enrollStatus === 'Enrolled' ? 'officially enrolled' : 'Temporary Enrolled'}</span> . You can view your official study load{' '}
                      <Link href={'/schedules'} className='text-blue-500 hover:underline'>
                        here
                      </Link>
                      .
                    </span>
                  </div>
                  <div className=''>{enrollment.requestWithdraw ? <CancelWithdrawDialog user={enrollment} /> : <WithdrawDialog user={enrollment} enrollmentSetup={enrollmentSetup} />}</div>
                  <div className='flex flex-col w-full '>
                    <span className='text-left sm:text-center w-full px-5 sm:px-10 mt-5 sm:mt-10 text-sm text-muted-foreground'>
                      <span className=' relative sm:hidden'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      This action cannot be cancelled while its being on process, this will only be undone by the administrator. For further information, please visit our support team at{' '}
                      <a href='/support' className='text-blue-600 underline'>
                        this link
                      </a>
                      , or check out our FAQ section for common inquiries, if you want to stop enrolling please contact us{' '}
                      <Link href={''} className='hover:underline hover:text-blue-600 text-blue-500'>
                        e2e2a@mondrey.com{' '}
                      </Link>
                      or visit our office for assistance.
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </>
      )}
    </>
  );
};

export default Congrats;
