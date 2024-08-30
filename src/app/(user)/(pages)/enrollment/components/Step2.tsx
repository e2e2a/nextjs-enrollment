import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Icons } from '@/components/shared/Icons';
import Link from 'next/link';

type IProps = {
  enrollment: any;
};
const Step2 = ({ enrollment }: IProps) => {
  if (!enrollment) return;
  return (
    <TabsContent value='2' className='p-5 focus-visible:ring-0 border-0'>
      <Card className={`${enrollment?.onProcess ? 'min-h-[35vh] shadow-none drop-shadow-none items-center justify-center flex border-0' : ''}`}>
        <CardHeader className='space-y-3 hidden'>
          <CardTitle className=' hidden'>Waiting for Approval!</CardTitle>
          <CardDescription className='text-center hidden'></CardDescription>
        </CardHeader>
        <CardContent className='flex w-full justify-center flex-col items-center border-[0.5px] rounded-lg shadow-sm bg-white focus-visible:ring-0 space-y-5 px-0 mx-0'>
          <div className='w-full flex flex-col items-center justify-center h-full'>
            <div className='w-full flex justify-center items-center md:my-4'>
              <Icons.hourglass className='md:h-14 md:w-14 h-10 w-10 my-3 stroke-green-400 animate-spin' style={{ animationDuration: '6s' }} />
            </div>
            <h1 className='text-center text-xl sm:text-3xl font-bold font-poppins text-green-400'>Verification of Enrollee!</h1>
            <span className='text-sm text-left sm:mt-10 mt-5 w-full px-5 sm:px-10'>
              Dear{' '}
              <span className='font-semibold capitalize'>
                <span className='capitalize'>{enrollment.profileId.firstname} </span>
                <span className='capitalize'>{enrollment.profileId.lastname}</span>
              </span>
              ,
            </span>
            <span className='text-sm text-left mt-4 px-5 sm:px-10 w-full'>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is from the administrator of DCIT. Please check your email that we are sending from the School of DCIT, and proceed to the DCIT registrar to verify your identity and information. We are doing this to
              prevent any incorrect information from being recorded and to ensure that all your details are accurate and up to date. It&apos;s important that we maintain accurate records for all students, so your prompt attention to this matter is greatly
              appreciated. If you have any questions or need further assistance, please do not hesitate to contact us +639123456789
            </span>
          </div>
          <div className='flex flex-col w-full '>
            <span className='text-left sm:text-center w-full px-5 sm:px-10 mt-5 sm:mt-10 text-sm text-muted-foreground'>
              <span className=' relative sm:hidden'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              This action cannot be cancelled while its being on process, this will only be undone by the administrator, if you want to stop enrolling please contact us{' '}
              <Link href={''} className='hover:underline hover:text-blue-600 text-blue-500'>
                jay.abandog@gmail.com{' '}
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
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default Step2;
