'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import LoaderPage from '@/components/shared/LoaderPage';
import { useTeacherScheduleQueryByCategory } from '@/lib/queries/teacherSchedule/get/category';
import { useProfileQueryBySessionId } from '@/lib/queries/profile/get/session';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const { data: pData, isLoading: pload, error: pError } = useProfileQueryBySessionId();
  const { data, isLoading, error: isEnError } = useTeacherScheduleQueryByCategory('College');

  useEffect(() => {
    if (isEnError || !data) return;
    if (pError || !pData) return;

    if (data && pData) {
      if (data.teacherSchedules) {
        const filteredSchedules = data.teacherSchedules.filter((p: any) => pData?.profile?.courseId?._id.toString() === p?.courseId?._id?.toString());
        setSchedules(filteredSchedules);
        setIsPageLoading(false);
      } else if (data.error) {
        setIsError(true);
        setIsPageLoading(false);
      }
    }
  }, [data, pData, isEnError, pError]);

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
            data &&
            data.teacherSchedules && (
              <div className=''>
                <div className='flex items-center py-4 text-black w-full justify-center'>
                  <h1 className='sm:text-3xl text-xl font-bold '>Instructors Management</h1>
                </div>
                <DataTable columns={columns} data={schedules as any[]} />
              </div>
            )
          )}
        </div>
      )}
    </>
  );
};

export default Page;
