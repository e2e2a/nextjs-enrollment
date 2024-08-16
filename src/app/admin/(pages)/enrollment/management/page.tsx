'use client';
import Loader from '@/components/shared/Loader';
import { useEnrollmentQueryByStep } from '@/lib/queries';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { columns } from './components/columns';
import { DataTable } from './components/DataTable';
interface Enrollment {
  id: string;
  userId: any
  courseId: any;
  studentYear: string;
  studentSemester: string;
  step: any
  createdAt: Date;
  updatedAt: Date;
}
const page = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get('step');
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [en, setEn] = useState([]);
  const isAllowed = ['1', '2', '3', '4'];

  useEffect(() => {
    const validateSearchParam = () => {
      if (search === null) {
        setIsError(true);
      } else if (!isAllowed.includes(search)) {
        // `step` parameter is invalid
        setIsError(true);
      } else {
        // `step` parameter is valid

        setIsError(false);
      }
      setIsPageLoading(false); // Set loading to false after validation
    };

    validateSearchParam();
  }, [search, isAllowed]);

  const { data, isLoading, error: isEnError } = useEnrollmentQueryByStep(search);
  useEffect(() => {
    if (isLoading || !data || !data.enrollment) {
      return;
    }
    if(isEnError) console.log(isEnError.message);
    if (data) {
      console.log('courses logs:', data.enrollment);
    }
  }, [data, isLoading, isEnError]);

  return <>{isPageLoading ? <Loader /> : <div className='bg-white min-h-[86vh] py-5 rounded-xl'>{isError ? <div className=''>404</div> : <DataTable columns={columns} data={data?.enrollment as Enrollment[]} />}</div>}</>;
};

export default page;
