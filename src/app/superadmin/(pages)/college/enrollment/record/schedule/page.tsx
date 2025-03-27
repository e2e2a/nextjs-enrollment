'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useTeacherScheduleRecordQueryByCategory } from '@/lib/queries/teacherScheduleRecord/get/category';
import LoaderPage from '@/components/shared/LoaderPage';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data, error: isEnError } = useTeacherScheduleRecordQueryByCategory('College');

  useEffect(() => {
    if (isEnError || !data) return;
    if (data) {
      if (data?.teacherScheduleRecords) {
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
              <div className='flex items-center py-4 text-black w-full justify-center'>
                <h1 className='sm:text-3xl text-xl font-semibold tracking-tight '>Schedule&apos;s Records</h1>
              </div>
              <DataTable columns={columns} data={data?.teacherScheduleRecords as any[]} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
