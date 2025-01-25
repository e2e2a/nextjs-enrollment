'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import LoaderPage from '@/components/shared/LoaderPage';
import { useProfileQueryBySessionId } from '@/lib/queries/profile/get/session';
import { useEnrollmentRecordQueryByCategory } from '@/lib/queries/enrollmentRecord/get/category';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [filteredEnrollments, setFilteredEnrollments] = useState<any>([]);

  const { data, isLoading, error: isEnError } = useEnrollmentRecordQueryByCategory('College');
  const { data: pData, isLoading: pload, error: pError } = useProfileQueryBySessionId();

  useEffect(() => {
    if (isEnError || !data) return;
    if (pError || !pData) return;

    if (data && pData) {
      if (data.enrollmentRecords && pData.profile) {
        const filteredEnrollment = data?.enrollmentRecords?.filter((enrollment: any) => enrollment.course === pData?.profile.courseId.name && enrollment.courseCode === pData?.profile.courseId.courseCode);
        setFilteredEnrollments(filteredEnrollment);
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
              <div className='flex items-center py-4 text-black w-full justify-center'>
                <h1 className='sm:text-3xl text-xl font-semibold tracking-tight '>Enrollments Record</h1>
              </div>
              <DataTable columns={columns} data={filteredEnrollments as any[]} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
