'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icons } from '@/components/shared/Icons';
import Image from 'next/image';
type IProps = {
  es: any;
};
const Open = ({ es }: IProps) => {
  const [value, setValue] = useState('');
  return (
    <div className='px-5 mt-[10%]'>
      {!es.open && (!es.semester || !es.schoolYear) && (
        <Card className={`min-h-[35vh] shadow-none drop-shadow-none items-center justify-center flex border-0`}>
          <CardHeader className='space-y-3 hidden'>
            <CardTitle className=''>
              <div className='flex flex-col justify-center gap-y-1 items-center'>
                <div className=''>
                  <Image src={'/images/logo1.png'} className='w-auto rounded-full' priority width={65} height={65} alt='nothing to say' />
                </div>
                <div className='text-center lg:text-left font-poppins'>Online Enrollment Form</div>
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
                <Image src={'/images/logo1.png'} className='w-auto rounded-full' priority width={65} height={65} alt='nothing to say' />
              </div>
              <div className='text-center text-2xl font-semibold tracking-tight'>Enrollment Opening Soon</div>
            </div>
            <span className='text-left sm:text-center w-full px-5 text-[16px] '>Exciting news! Enrollment will be opening soon. Get ready to secure your spot for the upcoming school year.</span>
            <span className='text-left sm:text-center w-full px-5 sm:px-10 mt-5 sm:mt-10 text-sm text-muted-foreground'>
              In the meantime, feel free to prepare any documents you may need and stay tuned for updates. If you have any questions, don’t hesitate to reach out to us at <span className='text-blue-500 cursor-pointer'>+639123456789</span> or{' '}
              <Link href={''} className='hover:underline hover:text-blue-600 text-blue-500'>
                jay.abandog@gmail.com
              </Link>
              .
            </span>
          </CardContent>
        </Card>
      )}
      {!es.open && (es.semester || es.schoolYear) && (
        <Card className={`min-h-[35vh] shadow-none drop-shadow-none items-center justify-center flex border-0`}>
          <CardHeader className='space-y-3 hidden'>
            <CardTitle className=''>
              <div className='flex flex-col justify-center gap-y-1 items-center'>
                <div className=''>
                  <Image src={'/images/logo1.png'} className='w-auto rounded-full' priority width={65} height={65} alt='nothing to say' />
                </div>
                <div className='text-center lg:text-left font-poppins'>Online Enrollment Form</div>
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
                <Image src={'/images/logo1.png'} className='w-auto rounded-full' priority width={65} height={65} alt='nothing to say' />
              </div>
              <div className='text-center text-2xl font-semibold tracking-tight'>Enrollment is Currently Closed</div>
            </div>
            <span className='text-left sm:text-center w-full px-5 text-[16px] '>Thank you for your interest! Enrollment is currently closed, but we appreciate your enthusiasm for the upcoming school year.</span>
            <span className='text-left sm:text-center w-full px-5 sm:px-10 mt-5 sm:mt-10 text-sm text-muted-foreground'>
              If you&apos;re eager to enroll and have any questions, we invite you to visit the registrar&apos;s office at DCIT INC. Our staff will be happy to assist you with any inquiries or information you may need. In the meantime, feel free to gather any
              necessary documents and stay tuned for updates on when enrollment will reopen. For further assistance, you can also reach us at <span className='text-blue-500 cursor-pointer'>+639123456789</span> or{' '}
              <Link href={''} className='hover:underline hover:text-blue-600 text-blue-500'>
                jay.abandog@gmail.com
              </Link>
              .
            </span>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Open;
