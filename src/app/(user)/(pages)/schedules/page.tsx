'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useTeacherScheduleCollegeQuery, useEnrollmentQueryByUserId, useEnrollmentSetupQuery } from '@/lib/queries';
import { useSession } from 'next-auth/react';
import LoaderPage from '@/components/shared/LoaderPage';

const Page = () => {
  const { data: session } = useSession();
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data, isLoading, error: isEnError } = useEnrollmentQueryByUserId(session?.user.id);
  const { data: b, isLoading: bLoading, error: bError } = useTeacherScheduleCollegeQuery();
  const { data: ESetup, isLoading: ESetupLoading, error: ESetupError } = useEnrollmentSetupQuery();

  useEffect(() => {
    if (bError || !b) return;
    if (isEnError || !data) return;
    if (ESetupError || !ESetup) return;

    if (b && data) {
      setIsPageLoading(false);
    }
  }, [b, bError, data, isEnError, ESetup, ESetupError]);

  return (
    <>
      {isPageLoading ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>
          <LoaderPage />
        </div>
      ) : isError ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          <div className=''>404</div>
        </div>
      ) : data && data.error ? (
        <span className=''>No enrollment form</span>
      ) : (
        data?.enrollment && (
          <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
            <div className='flex items-center py-4 text-black text-center flex-col mb-7'>
              <div className='mb-3'>
                <h1 className='text-lg sm:text-2xl font-bold uppercase'>Student Schedules</h1>
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
                    Block: <span className='font-normal'>{data.enrollment.blockTypeId.section}</span>
                  </span>
                </div>
                <div className='flex w-full justify-start'>
                  <span className='text-sm sm:text-[17px] font-bold capitalize'>
                    Enrollment Status: <span className='font-normal text-blue-500'>{data.enrollment.enrollStatus}</span>
                  </span>
                </div>
              </div>
            </div>
            <DataTable columns={columns} data={data?.enrollment.studentSubjects} enrollmentSetup={ESetup.enrollmentSetup} enrollment={data.enrollment} />
          </div>
        )
      )}
    </>
  );
};

export default Page;
