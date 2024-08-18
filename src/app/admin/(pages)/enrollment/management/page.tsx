'use client';
import Loader from '@/components/shared/Loader';
import { useEnrollmentQueryByStep } from '@/lib/queries';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { columns } from './components/columns';
import { DataTable } from './components/DataTable';
import { Button } from '@/components/ui/button';
interface Enrollment {
  id: string;
  userId: any;
  courseId: any;
  studentYear: string;
  studentSemester: string;
  step: any;
  createdAt: Date;
  updatedAt: Date;
}
const page = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get('step');
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const isAllowed = ['1', '2', '3', '4'];
  const [isStep, setIsStep] = useState('1');
  console.log(search)
  // Validate the step parameter whenever the search parameter changes
  useEffect(() => {
    if (search === null || !isAllowed.includes(search)) {
      setIsError(true);
    } else {
      setIsError(false);
    }
    setIsPageLoading(false); // Loading is done after validation
  }, [search, isAllowed]);

  // Query data based on the validated step parameter
  const { data, isLoading, error: isEnError } = useEnrollmentQueryByStep(search || '');

  useEffect(() => {
    if (isLoading || !data || !data.enrollment) return;
    if (isEnError) console.log(isEnError.message);
    if (data) console.log('courses logs:', data.enrollment);
  }, [data, isLoading, isEnError]);

  return (
    <>
      {isPageLoading ? <Loader /> : <div className='bg-white min-h-[86vh] py-5 rounded-xl'>{isError ? <div className=''>404</div> : <DataTable columns={columns} data={data?.enrollment as Enrollment[]} />}<Button
        onClick={() => {
          setIsStep(isStep + 1);
        }}
      >
        click me
      </Button></div>}

      
    </>
  );
};

export default page;
