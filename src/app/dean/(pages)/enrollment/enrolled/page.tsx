'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { IEnrollment } from '@/types';
import LoaderPage from '@/components/shared/LoaderPage';
import { useProfileQueryBySessionId } from '@/lib/queries/profile/get/session';
import { useAllEnrollmentQueryByCourseId } from '@/lib/queries/enrollment/get/courseId/dean';
import OptionsExport from './components/OptionsExport';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [enrolledStudents, setEnrolledStudents] = useState<any>([]);

  const { data: pData, error: pError } = useProfileQueryBySessionId();
  const { data, error: isEnError } = useAllEnrollmentQueryByCourseId(pData?.profile?.courseId?._id);

  useEffect(() => {
    if (isEnError || !data) return;
    if (pError || !pData) return;

    if (data && pData) {
      if (data.students && pData.profile) {
        const filteredEnrollment = data?.students?.filter((enrollment: any) => enrollment.enrollStatus === 'Enrolled');
        setEnrolledStudents(filteredEnrollment);
        setIsError(false);
      } else if (data.error) {
        setIsError(true);
      }
      setIsPageLoading(false);
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
              <OptionsExport data={enrolledStudents || []} />
              <div className='mb-3 text-center w-full'>
                <h1 className='text-lg sm:text-2xl font-bold uppercase'>Enrolled Student Management</h1>
              </div>
              <div className='grid sm:grid-cols-2 grid-cols-1 items-start w-full gap-y-1'>
                <div className='justify-between items-start flex w-full'>
                  <span className='text-sm sm:text-[17px] font-bold capitalize'>
                    Department: <span className='font-normal'>{pData?.profile?.courseId?.name}</span>
                  </span>
                </div>
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
