'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useAllStudentEnrollmentRecordCollegeQuery, useStudentEnrollmentRecordByProfileIdQuery } from '@/lib/queries';
import LoaderPage from '@/components/shared/LoaderPage';
import { useSession } from 'next-auth/react';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data: s } = useSession();
  
  const { data, isLoading, error: isEnError } = useAllStudentEnrollmentRecordCollegeQuery('College');

  useEffect(() => {
    if (isEnError || !data) return;

    if (data) {
      if (data.enrollmentRecords) {
        setIsPageLoading(false);
      }
    }
  }, [data, isEnError]);

  return (
    <>
      {isPageLoading ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>
          <LoaderPage />
        </div>
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          {isError ? (
            <div className=''>404</div>
          ) : (
            <div className=''>
              <div className='flex items-center py-4 text-black w-full justify-center'>
                <h1 className='sm:text-3xl text-xl font-semibold tracking-tight '>Enrollments Record</h1>
              </div>
              <DataTable columns={columns} data={data.enrollmentRecords as any[]} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
