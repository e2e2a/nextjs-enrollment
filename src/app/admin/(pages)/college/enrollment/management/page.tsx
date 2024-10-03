'use client';
import Loader from '@/components/shared/Loader';
import { useEnrollmentQueryByStep, useEnrollmentSetupQuery } from '@/lib/queries';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { columns } from './components/step1/columns';
import { columns2 } from './components/step2/columns';
import { DataTable1 } from './components/step1/DataTable';
import { Button } from '@/components/ui/button';
import { DataTableDrawer } from './components/Drawer';
import { DataTable2 } from './components/step2/DataTable2';
import { IEnrollment } from '@/types';
import { columns4 } from './components/step4/Columns4';
import { DataTable4 } from './components/step4/DataTable4';
import { DataTable3 } from './components/step3/DataTable3';
import { columns3 } from './components/step3/Columns3';
import { DataTable5 } from './components/step5/DataTable5';
import { columns5 } from './components/step5/Columns5';
import EnableADW from './components/step4/EnableADW';
import { DataTable6 } from './components/step6/DataTable6';
import { columns6 } from './components/step6/Columns6';

const Page = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get('step');
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [enrolledStudents, setEnrolledStudents] = useState<any>([]);
  const isAllowed = useMemo(() => ['1', '2', '3', '4', '5', '6'], []);
  // Validate the step parameter whenever the search parameter changes

  useEffect(() => {
    if (search === null || !isAllowed.includes(search)) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }, [search, isAllowed]);

  // Query data based on the validated step parameter
  const { data, isLoading, error: isEnError } = useEnrollmentQueryByStep(search);
  const { data: ESetup, isLoading: ESetupLoading, error: ESetupError } = useEnrollmentSetupQuery();
  useEffect(() => {
    if (isEnError || !data) return;
    if (ESetupError || !ESetup) return;

    if (data && ESetup) {
      if (data.enrollment && ESetup.enrollmentSetup) {
        const filteredEnrollment = data?.enrollment?.filter((enrollment: any) => enrollment.enrollStatus !== 'Enrolled');
        setEnrolledStudents(filteredEnrollment);
        setIsPageLoading(false);
        return;
      }
    }
  }, [data, isEnError, ESetup, ESetupError]);

  return (
    <>
      {isPageLoading ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>
          <Loader />
        </div>
      ) : (
        data &&
        data.enrollment && (
          <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
            {isError ? (
              <div className=''>404</div>
            ) : search === '1' ? (
              <div className=''>
                <div className='flex items-center py-4 text-black w-full justify-center'>
                  <h1 className='sm:text-3xl text-xl font-bold '>Step1: Verify Enrollee Information</h1>
                </div>
                <DataTable1 columns={columns} data={data?.enrollment as IEnrollment[]} />
              </div>
            ) : search === '2' ? (
              <div className=''>
                <div className='flex items-center py-4 text-black w-full justify-center'>
                  <h1 className='sm:text-3xl text-xl font-bold '>Step2: Evaluate the Student</h1>
                </div>
                <DataTable2 columns={columns2} data={data?.enrollment as IEnrollment[]} />
              </div>
            ) : search === '3' ? (
              <div className=''>
                <div className='flex items-center py-4 text-black w-full justify-center'>
                  <h1 className='sm:text-3xl text-xl font-bold '>Step3: Add Subjects of Enrollee</h1>
                </div>
                <DataTable3 columns={columns3} data={data?.enrollment as IEnrollment[]} />
              </div>
            ) : search === '4' ? (
              <div className=''>
                <div className='flex flex-col items-center py-4 text-black w-full justify-center'>
                  <h1 className='sm:text-3xl text-xl font-bold '>Step4: Approval of Add/Drop Subject Request</h1>
                  <EnableADW enrollmentSetup={ESetup.enrollmentSetup} />
                </div>
                <DataTable4 columns={columns4} data={data?.enrollment as IEnrollment[]} />
              </div>
            ) : search === '5' ? (
              <div className=''>
                <div className='flex items-center py-4 text-black w-full justify-center'>
                  <h1 className='sm:text-3xl text-xl font-bold '>Step5: Student Payment</h1>
                </div>
                <DataTable5 columns={columns5} data={enrolledStudents as IEnrollment[]} />
              </div>
            ) : search === '6' ? (
              <div className=''>
                <div className='flex items-center py-4 text-black w-full justify-center'>
                  <h1 className='sm:text-3xl text-xl font-bold '>Step5: Payment Method</h1>
                </div>
                <DataTable6 columns={columns6} data={enrolledStudents as IEnrollment[]} />
              </div>
            ) : null}
            {/* <DataTableDrawer /> */}
          </div>
        )
      )}
    </>
  );
};

export default Page;
