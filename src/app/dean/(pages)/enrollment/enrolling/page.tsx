'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useAllEnrollmentQuery, useDeanProfileQuery } from '@/lib/queries';
import { IEnrollment } from '@/types';
import { useSession } from 'next-auth/react';
import LoaderPage from '@/components/shared/LoaderPage';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [enrolledStudents, setEnrolledStudents] = useState<any>([]);

  const { data: s } = useSession();
  const { data: pData, isLoading: pload, error: pError } = useDeanProfileQuery(s?.user.id as string);
  const { data, isLoading, error: isEnError } = useAllEnrollmentQuery();

  useEffect(() => {
    if (isEnError || !data) return;
    if (pError || !pData) return;

    if (data && pData) {
      if (data.enrollment && pData.profile) {
        const filteredEnrollment = data?.enrollment?.filter((enrollment: any) => enrollment.enrollStatus !== 'Enrolled' && enrollment.courseId.name === pData?.profile.courseId.name);
        setEnrolledStudents(filteredEnrollment);
        setIsPageLoading(false);
      }
    }
  }, [data, isEnError, pData, pError]);

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
              <div className='mb-3 text-center w-full'>
                <h1 className='text-lg sm:text-2xl font-bold uppercase'>Enrolling Students Management</h1>
              </div>
              <div className='grid sm:grid-cols-2 grid-cols-1 items-start w-full gap-y-1'>
                <div className='justify-between items-start flex w-full'>
                  <span className='text-sm sm:text-[17px] font-bold capitalize'>
                    Department: <span className='font-normal'>{pData?.profile.courseId.name}</span>
                  </span>
                </div>
                {/* <div className='flex w-full justify-start sm:justify-end'>
                  <span className='text-sm sm:text-[17px] font-bold capitalize'>
                    Block: <span className='font-normal'>{data.reportedGrades.teacherScheduleId.blockTypeId.section}</span>
                  </span>
                </div> */}
              </div>
              <DataTable columns={columns} data={enrolledStudents as IEnrollment[]} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
