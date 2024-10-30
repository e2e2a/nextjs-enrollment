'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useTeacherScheduleCollegeQuery, useEnrollmentSetupQuery } from '@/lib/queries';
import { useSession } from 'next-auth/react';
import LoaderPage from '@/components/shared/LoaderPage';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useEnrollmentQueryBySessionId } from '@/lib/queries/enrollment/get/session';

const Page = () => {
  const { data: session } = useSession();
  const [schedule, setSchedule] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data, isLoading, error: isEnError } = useEnrollmentQueryBySessionId(session?.user.id!);
  const { data: b, isLoading: bLoading, error: bError } = useTeacherScheduleCollegeQuery();
  const { data: ESetup, isLoading: ESetupLoading, error: ESetupError } = useEnrollmentSetupQuery();

  useEffect(() => {
    if (bError || !b) return;
    if (isEnError || !data) return;
    if (ESetupError || !ESetup) return;
    console.log('en', data);

    if (b && data && ESetup) {
      if (data.enrollment) {
        const filteredSchedules = data.enrollment?.studentSubjects?.filter((ss: any) => ss.status === 'Approved');
        if (ESetup.enrollmentSetup.addOrDropSubjects) {
          setSchedule(data.enrollment?.studentSubjects);
        } else {
          if (data.enrollment?.enrollStatus === 'Enrolled') {
            setSchedule(filteredSchedules);
          } else {
            setSchedule(data.enrollment?.studentSubjects);
          }
        }
      }
      setIsPageLoading(false);
    }
  }, [b, bError, data, isEnError, ESetup, ESetupError]);

  return (
    <>
      {isPageLoading ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>
          <LoaderPage />
        </div>
      ) : data && data.error ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          <Card className={`min-h-[35vh] shadow-none drop-shadow-none items-center justify-center flex border-0`}>
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
                  {' '}
                  View Available Course in Categories 👉{' '}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      ) : data && data.enrollment ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          <div className='flex items-center py-4 text-black text-center flex-col mb-7'>
            <div className='mb-3'>
              <h1 className='text-lg sm:text-2xl font-bold uppercase'>Student&apos; Schedules</h1>
            </div>
            <div className='grid sm:grid-cols-2 grid-cols-1 items-start w-full gap-y-1'>
              <div className='justify-between items-center flex w-full'>
                <span className='text-sm sm:text-[17px] font-bold capitalize'>
                  Fullname:{' '}
                  <span className='font-normal'>
                    {data.enrollment.profileId.firstname} {data.enrollment.profileId.middlename} {data.enrollment.profileId.lastname} {data.enrollment.profileId.extensionName ? data.enrollment.profileId.extensionName : ''}
                  </span>
                </span>
              </div>
              <div className='flex w-full justify-start sm:justify-end'>
                <span className='text-sm sm:text-[17px] font-bold capitalize'>
                  Department: <span className='font-normal'>{data.enrollment.courseId.name}</span>
                </span>
              </div>
              <div className='flex w-full justify-start '>
                <span className='text-sm sm:text-[17px] font-bold capitalize'>
                  Year:{' '}
                  <span className='font-normal'>
                    {data.enrollment.studentYear} - {data.enrollment.studentSemester}
                  </span>
                </span>
              </div>
              <div className='flex w-full justify-start sm:justify-end'>
                <span className='text-sm sm:text-[17px] font-bold capitalize'>
                  Block: <span className='font-normal'>{data.enrollment?.blockTypeId?.section ? data.enrollment.blockTypeId.section : 'N/A'}</span>
                </span>
              </div>
              <div className='flex w-full justify-start'>
                <span className='text-sm sm:text-[17px] font-bold capitalize'>
                  Enrollment Status:{' '}
                  {data.enrollment.enrollStatus === 'Pending' ? (
                    <span className='font-normal text-blue-500'>{data.enrollment.enrollStatus}</span>
                  ) : data.enrollment.enrollStatus === 'Enrolled' ? (
                    <span className='font-normal text-green-500'>{data.enrollment.enrollStatus}</span>
                  ) : (
                    <span>{data.enrollment.enrollStatus}</span>
                  )}
                </span>
              </div>
            </div>
          </div>
          <DataTable columns={columns} data={schedule} enrollmentSetup={ESetup.enrollmentSetup} enrollment={data.enrollment} />
        </div>
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
                  {' '}
                  View Available Course in Categories 👉{' '}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default Page;
