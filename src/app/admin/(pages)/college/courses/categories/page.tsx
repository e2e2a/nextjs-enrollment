'use client';
import Loader from '@/components/shared/Loader';
import { useCourseQueryByCategory, useEnrollmentQueryByStep } from '@/lib/queries';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable1 } from './components/college/DataTable';
import { columns } from './components/college/Columns';

interface ICourse {
  id: string;
  _id: string;
  category: any;
  courseCode: any;
  name: string;
  imageUrl: any;
  description: any;
  createdAt: Date;
  updatedAt: Date;
}
const Page = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get('category');
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  // const isAllowed = ['1', '2', '3', '4'];
  const isAllowed = useMemo(() => ['Nursery', 'Kindergarten 1&2', 'Junior High School', 'Senior High School', 'Tesda', 'College'], []);
  // console.log(search);
  // Validate the step parameter whenever the search parameter changes
  useEffect(() => {
    if (search === null || !isAllowed.includes(search)) {
      setIsError(true);
    } else {
      setIsError(false);
    }
    setIsPageLoading(false); // Loading is done after validation
  }, [search, isAllowed, isPageLoading]);

  // Query data based on the validated step parameter
  const { data, isLoading, error: isEnError } = useCourseQueryByCategory(search);

  useEffect(() => {
    if (isLoading || !data || !data.courses) return;
    if (isEnError) console.log(isEnError.message);
    if (data) console.log('courses logs:', data.courses);
  }, [data, isLoading, isEnError]);

  return (
    <>
      {isPageLoading ? (
        <Loader />
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          {
            isError ? <div className=''>404</div> : search === 'College' ? <DataTable1 columns={columns} data={data?.courses as ICourse[]} /> : search === '2' ? null : search === '3'
            // : search === '3'
            // : search === '4'
            //else if === 2
            //else if === 3
            //else if === 4
          }
          {/* <DataTableDrawer /> */}
        </div>
      )}
    </>
  );
};

export default Page;
