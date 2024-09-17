'use client';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useAllEnrollmentQuery } from '@/lib/queries';
import { IEnrollment } from '@/types';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [enrolledStudents, setEnrolledStudents] = useState<any>([]);
  // Query data based on the validated step parameter
  const { data, isLoading, error: isEnError } = useAllEnrollmentQuery();

  useEffect(() => {
    if (isLoading || !data || !data.enrollment) return;
    if (isEnError) console.log(isEnError.message);
    if (data) console.log('courses logs:', data.enrollment);
    if (data.enrollment) {
      const filteredEnrollment = data?.enrollment?.filter((enrollment: any) => enrollment.enrollStatus === 'Enrolled');
      setEnrolledStudents(filteredEnrollment);
      setIsPageLoading(false);
    }
  }, [data, isLoading, isEnError]);

  return (
    <>
      {isPageLoading ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>
          <Loader />
        </div>
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>{isError ? <div className=''>404</div> : <DataTable columns={columns} data={enrolledStudents as IEnrollment[]} />}</div>
      )}
    </>
  );
};

export default Page;
