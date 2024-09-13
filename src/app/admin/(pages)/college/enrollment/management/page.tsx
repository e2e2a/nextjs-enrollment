'use client';
import Loader from '@/components/shared/Loader';
import { useEnrollmentQueryByStep } from '@/lib/queries';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { columns } from './components/step1/columns';
import { columns2 } from './components/step2/columns';
import { DataTable1 } from './components/step1/DataTable';
import { Button } from '@/components/ui/button';
import { DataTableDrawer } from './components/Drawer';
import { DataTable2 } from './components/step2/DataTable2';
import { DataTable3 } from './components/step3/DataTable3';
import { IEnrollment } from '@/types';

const Page = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get('step');
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  // const isAllowed = ['1', '2', '3', '4'];
  const isAllowed = useMemo(() => ['1', '2', '3', '4'], []);
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
  const { data, isLoading, error: isEnError } = useEnrollmentQueryByStep(search);

  useEffect(() => {
    if (isLoading || !data || !data.enrollment) return;
    if (isEnError) console.log(isEnError.message);
    if (data) console.log('courses logs:', data.enrollment);
  }, [data, isLoading, isEnError]);

  return (
    <>
      {isPageLoading ? (
        <Loader />
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          {
            isError ? (
              <div className=''>404</div>
            ) : search === '1' ? (
              <DataTable1 columns={columns} data={data?.enrollment as IEnrollment[]} />
            ) : search === '2' ? (
              <DataTable2 columns={columns2} data={data?.enrollment as IEnrollment[]} />
            ) : search === '3' ? (
              <DataTable3 columns={columns2} data={data?.enrollment as IEnrollment[]} />
            ) : search === '4' ? (
              <DataTable3 columns={columns2} data={data?.enrollment as IEnrollment[]} />
            ) : (
              search === '5'
            )

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
