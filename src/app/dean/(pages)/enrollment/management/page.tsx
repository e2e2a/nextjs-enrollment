'use client';
import { useEnrollmentSetupQuery } from '@/lib/queries/enrollmentSetup/get';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { columns } from './components/step1/columns';
import { columns2 } from './components/step2/columns';
import { DataTable1 } from './components/step1/DataTable';
import { DataTable2 } from './components/step2/DataTable2';
import { IEnrollment } from '@/types';
import { columns4 } from './components/step4/Columns4';
import { DataTable4 } from './components/step4/DataTable4';
import { DataTable3 } from './components/step3/DataTable3';
import { columns3 } from './components/step3/Columns3';
import { DataTable5 } from './components/step5/DataTable5';
import { columns5 } from './components/step5/Columns5';
import { DataTable6 } from './components/step6/DataTable6';
import { columns6 } from './components/step6/Columns6';
import { useProfileQueryBySessionId } from '@/lib/queries/profile/get/session';
import { useEnrollmentQueryStepByCategory } from '@/lib/queries/enrollment/get/step';
import LoaderPage from '@/components/shared/LoaderPage';
import OptionsExport from './components/OptionsExport';

const Page = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get('step');
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [toFilterData, setToFilterData] = useState<any>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<any>([]);
  const isAllowed = useMemo(() => ['1', '2', '3', '4', '5', '6'], []);
  // Validate the step parameter whenever the search parameter changes
  const { data: pData, isLoading: pload, error: pError } = useProfileQueryBySessionId();
  useEffect(() => {
    if (search === null || !isAllowed.includes(search)) {
      setIsError(true);
    } else if (pData && pData.profile) {
      setToFilterData({
        category: pData?.profile?.courseId?.category,
        step: search,
      });
      setIsError(false);
    }
  }, [search, pData, isAllowed]);

  const { data, isLoading, error: isEnError } = useEnrollmentQueryStepByCategory(toFilterData);
  const { data: ESetup, isLoading: ESetupLoading, error: ESetupError } = useEnrollmentSetupQuery();
  useEffect(() => {
    if (isEnError || !data) return;
    if (ESetupError || !ESetup) return;
    if (pError || !pData) return;

    if (data && ESetup && pData) {
      if (data.enrollment && ESetup.enrollmentSetup && pData.profile) {
        const filteredEnrollment = data?.enrollment?.filter((enrollment: any) => enrollment?.enrollStatus !== 'Enrolled' && enrollment?.enrollStatus !== 'Temporary Enrolled');
        setEnrolledStudents(filteredEnrollment);
        setIsPageLoading(false);
        return;
      }
    }
  }, [data, isEnError, ESetup, ESetupError, pData, pError]);

  return (
    <>
      {isPageLoading ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>
          <LoaderPage />
        </div>
      ) : (
        data &&
        data.enrollment && (
          <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
            {isError ? (
              <div className=''>404</div>
            ) : search === '1' ? (
              <div className=''>
                <OptionsExport data={data?.enrollment || []} step={1} />
                <div className='flex items-center py-4 text-black w-full justify-center'>
                  <h1 className='sm:text-3xl text-xl font-bold '>Step1: Verify Enrollee Information</h1>
                </div>
                <div className='grid sm:grid-cols-2 grid-cols-1 items-start w-full gap-y-1'>
                  <div className='justify-between items-start flex w-full'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Department: <span className='font-normal'>{pData?.profile.courseId?.name}</span>
                    </span>
                  </div>
                </div>
                <DataTable1 columns={columns} data={data.enrollment as IEnrollment[]} />
              </div>
            ) : search === '2' ? (
              <div className=''>
                <OptionsExport data={data?.enrollment || []} step={2} />
                <div className='flex items-center py-4 text-black w-full justify-center'>
                  <h1 className='sm:text-3xl text-xl font-bold '>Step2: Evaluate the Student</h1>
                </div>
                <div className='grid sm:grid-cols-2 grid-cols-1 items-start w-full gap-y-1'>
                  <div className='justify-between items-start flex w-full'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Department: <span className='font-normal'>{pData?.profile?.courseId?.name}</span>
                    </span>
                  </div>
                </div>
                <DataTable2 columns={columns2} data={data.enrollment as IEnrollment[]} />
              </div>
            ) : search === '3' ? (
              <div className=''>
                <OptionsExport data={data?.enrollment || []} step={3} />
                <div className='flex items-center py-4 text-black w-full justify-center'>
                  <h1 className='sm:text-3xl text-xl font-bold '>Step3: Add Subjects of Enrollee</h1>
                </div>
                <div className='grid sm:grid-cols-2 grid-cols-1 items-start w-full gap-y-1'>
                  <div className='justify-between items-start flex w-full'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Department: <span className='font-normal'>{pData?.profile?.courseId?.name}</span>
                    </span>
                  </div>
                </div>
                <DataTable3 columns={columns3} data={data.enrollment as IEnrollment[]} />
              </div>
            ) : search === '4' ? (
              <div className=''>
                <OptionsExport data={data?.enrollment || []} step={4} />
                <div className='flex flex-col items-center py-4 text-black w-full justify-center'>
                  <h1 className='sm:text-3xl text-xl font-bold '>Step4: Approval of Add/Drop Subject Request</h1>
                  {/* <EnableADW enrollmentSetup={ESetup.enrollmentSetup} /> */}
                </div>
                <div className='grid sm:grid-cols-2 grid-cols-1 items-start w-full gap-y-1'>
                  <div className='justify-between items-start flex w-full'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Department: <span className='font-normal'>{pData?.profile?.courseId?.name}</span>
                    </span>
                  </div>
                </div>
                <DataTable4 columns={columns4} data={data?.enrollment as IEnrollment[]} />
              </div>
            ) : search === '5' ? (
              <div className=''>
                <OptionsExport data={data?.enrollment || []} step={5} />
                <div className='flex items-center py-4 text-black w-full justify-center'>
                  <h1 className='sm:text-3xl text-xl font-bold '>Step5: Student Payment</h1>
                </div>
                <div className='grid sm:grid-cols-2 grid-cols-1 items-start w-full gap-y-1'>
                  <div className='justify-between items-start flex w-full'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Department: <span className='font-normal'>{pData?.profile?.courseId?.name}</span>
                    </span>
                  </div>
                </div>
                <DataTable5 columns={columns5} data={data.enrollment as IEnrollment[]} />
              </div>
            ) : search === '6' ? (
              <div className=''>
                <OptionsExport data={enrolledStudents || []} step={6} />
                <div className='flex items-center py-4 text-black w-full justify-center'>
                  <h1 className='sm:text-3xl text-xl font-bold '>Step6: Finalizing Student Enrollment</h1>
                </div>
                <div className='grid sm:grid-cols-2 grid-cols-1 items-start w-full gap-y-1'>
                  <div className='justify-between items-start flex w-full'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Department: <span className='font-normal'>{pData?.profile.courseId?.name}</span>
                    </span>
                  </div>
                </div>
                <DataTable6 columns={columns6} data={enrolledStudents as IEnrollment[]} />
              </div>
            ) : null}
          </div>
        )
      )}
    </>
  );
};

export default Page;
