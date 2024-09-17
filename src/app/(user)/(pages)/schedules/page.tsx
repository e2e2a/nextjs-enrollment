'use client';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useTeacherScheduleCollegeQuery, useEnrollmentQueryByUserId } from '@/lib/queries';
import { useSession } from 'next-auth/react';

const Page = () => {
  const { data: session } = useSession();
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data, isLoading, error: isEnError } = useEnrollmentQueryByUserId(session?.user.id);
  const { data: b, isLoading: bLoading, error: bError } = useTeacherScheduleCollegeQuery();
  useEffect(() => {
    if (isLoading || !data) return;
    if (isEnError) setIsError(true);
  }, [data, isLoading, isEnError]);
  useEffect(() => {
    if (bLoading || !b) return;
    if (bError) setIsError(true);
  }, [b, bLoading, bError]);

  useEffect(() => {
    if (b && data) {
      setIsPageLoading(false);
    }
  }, [b, data]);
  console.log(data);
  return (
    <>
      {isPageLoading ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>
          <Loader />
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
                <div>
                  <h1 className='text-lg sm:text-2xl font-bold uppercase'>Student Subjects</h1>
                </div>
                <div className=''>
                  <h1 className='text-sm sm:text-lg font-bold capitalize'>{data.enrollment.courseId.name}</h1>
                </div>
                <div className=''>
                  <h1 className='text-sm font-bold'>
                    {data.enrollment.studentYear} - {data.enrollment.studentSemester}
                  </h1>
                </div>
                <div className=''>
                  <h1 className='text-xs font-bold'>
                    Enrollment Status: <span className='text-blue-500'>{data.enrollment.enrollStatus}</span>
                  </h1>
                </div>
              </div>
            <DataTable columns={columns} data={data?.enrollment.studentSubjects} />
          </div>
        )
      )}
    </>
  );
};

export default Page;
