'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useTeacherScheduleQueryByCategory } from '@/lib/queries/teacherSchedule/get/category';
import { useProfileQueryBySessionId } from '@/lib/queries/profile/get/session';
import LoaderPage from '@/components/shared/LoaderPage';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data: pData, isLoading: pload, error: pError } = useProfileQueryBySessionId();
  const { data, isLoading, error: isEnError } = useTeacherScheduleQueryByCategory('College');

  useEffect(() => {
    if (isEnError || !data) return;
    if (pError || !pData) return;

    if (data && pData) {
      if (data.teacherSchedules) {
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
            data && (
              <div className=''>
                <div className='mb-3 text-center w-full'>
                  <h1 className='text-lg sm:text-2xl font-bold uppercase'>Schedule Management</h1>
                </div>
                <div className='grid sm:grid-cols-2 grid-cols-1 items-start w-full gap-y-1 mb-10'>
                  <div className='justify-between items-start flex w-full'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Department: <span className='font-normal'>{pData?.profile.courseId.name}</span>
                    </span>
                  </div>
                </div>
                <DataTable columns={columns} data={data?.teacherSchedules as any[]} />
              </div>
            )
          )}
        </div>
      )}
    </>
  );
};

export default Page;
