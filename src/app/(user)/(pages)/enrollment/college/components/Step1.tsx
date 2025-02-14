'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import React, { useEffect, useState } from 'react';
import { useEnrollmentDeleteMutation } from '@/lib/queries';
import { useSession } from 'next-auth/react';
import { Icons } from '@/components/shared/Icons';
import LoaderPage from '@/components/shared/LoaderPage';
import Link from 'next/link';

type IProps = {
  search: any;
  enrollment: any;
};
const Step1 = ({ search, enrollment }: IProps) => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { data: s } = useSession();
  useEffect(() => {
    if (!enrollment) return;
    if (enrollment) return setIsPageLoading(false);

    console.log('me and you');
  }, [enrollment]);

  const deleteMutation = useEnrollmentDeleteMutation();

  const handleDeleteEnrollment = (EId: any) => {
    deleteMutation.mutate(EId, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            // if (res.error) return window.location.reload();
            // setMessage(res?.message);
            // return (window.location.reload());
            return;
          default:
            // setMessage(res.error);
            // setTypeMessage('error');
            return;
        }
      },
    });
  };
  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <TabsContent value='1' className='p-5 focus-visible:ring-0 border-0'>
          <Card className={`min-h-[35vh] shadow-none drop-shadow-none items-center justify-center flex border-0`}>
            <CardHeader className='space-y-3 hidden'>
              <CardTitle className=' hidden'>Waiting for Approval!</CardTitle>
              <CardDescription className='text-center hidden'></CardDescription>
            </CardHeader>
            <CardContent className='flex w-full justify-center flex-col rounded-lg shadow-sm bg-white items-center border focus-visible:ring-0 space-y-5 px-0 mt-7'>
              <div className='w-full flex flex-col items-center justify-center h-full'>
                <div className=' mt-3'>
                  <h1 className='text-center text-xl sm:text-3xl font-semibold text-black uppercase'>waiting Confirmation</h1>
                </div>
                <div className='w-full flex justify-center items-center md:my-4'>
                  <Icons.hourglass className='md:h-14 md:w-14 h-10 w-10 my-3 stroke-green-400 fill-gray-100 animate-spin' style={{ animationDuration: '6s' }} />
                </div>
                {/* <h1 className='text-center text-xl sm:text-3xl font-bold font-poppins text-green-400 px-4'>Awaiting Confirmation!</h1> */}
                <span className='text-sm text-left sm:mt-10 mt-5 w-full px-5 sm:px-10'>
                  Dear{' '}
                  <span className='font-semibold capitalize'>
                    <span className='capitalize'>{enrollment?.profileId?.firstname ?? ''} </span>
                    <span className='capitalize'>{enrollment?.profileId?.lastname ?? ''}</span>
                  </span>
                  ,
                </span>
                <span className='text-sm text-left mt-4 px-5 sm:px-10 w-full'>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is from the administrator of DCIT. Please wait a couple of hours, once the administrator sees your submission, they will begin reviewing your credentials and process it right away. After approval, you
                  will automatically proceed to step 2, and we will notify you via email and on this website. If you have any questions or need further assistance, please read our docs; documentation is available at{' '}
                  <a href='/documentation' className='text-blue-600 underline'>
                    this link
                  </a>
                  .
                </span>
              </div>
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
                <div className=' w-full  justify-center items-center flex'>
                  {/* <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={'outline'} size={'sm'} className='select-none focus-visible:ring-0 text-[15px] bg-red text-white tracking-normal font-medium font-poppins'>
                    Cancel Enrollment
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className='bg-white'>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className='hover:bg-slate-100 focus-visible:ring-0 '>Cancel</AlertDialogCancel>
                    <AlertDialogAction type='submit' className='border rounded-lg hover:bg-slate-100 focus-visible:ring-0 ' onClick={() => handleDeleteEnrollment(enrollment._id)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog> */}
                </div>
              </div>
              {/* <div className='flex flex-col w-full space-y-3'>
            <span className='text-left sm:text-center w-full px-5 sm:px-10 mt-5 sm:mt-10 text-sm text-muted-foreground'>
              <span className=' relative sm:hidden'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>If you are undecided with your course you can cancel it anytime.
            </span>
            <div className=' w-full flex justify-center items-center'>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={'outline'} size={'sm'} className='select-none focus-visible:ring-0 text-[15px] bg-red text-white tracking-normal font-medium font-poppins'>
                    Cancel Enrollment
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className='bg-white'>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className='hover:bg-slate-100 focus-visible:ring-0 '>Cancel</AlertDialogCancel>
                    <AlertDialogAction type='submit' className='border rounded-lg hover:bg-slate-100 focus-visible:ring-0 ' onClick={() => handleDeleteEnrollment(enrollment._id)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div> */}
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </>
  );
};

export default Step1;
