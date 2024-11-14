'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { IEnrollment } from '@/types';
import LoaderPage from '@/components/shared/LoaderPage';
import { useProfileQueryBySessionId } from '@/lib/queries/profile/get/session';
import { useAllEnrollmentQueryByCourseId } from '@/lib/queries/enrollment/get/courseId/dean';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [enrolledStudents, setEnrolledStudents] = useState<any>([]);

  const { data: pData, isLoading: pload, error: pError } = useProfileQueryBySessionId();
  const { data, isLoading, error: isEnError } = useAllEnrollmentQueryByCourseId(pData?.profile?.courseId._id);

  useEffect(() => {
    if (isEnError || !data) return;
    if (data) {
      if (data.students) {
        const filteredEnrollment = data?.students?.filter((enrollment: any) => enrollment.enrollStatus === 'Temporary Enrolled');
        setEnrolledStudents(filteredEnrollment);
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
              <div className='mb-3 text-center w-full'>
                <h1 className='text-lg sm:text-2xl font-bold uppercase'>Temporary Enrolled Student Management</h1>
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
