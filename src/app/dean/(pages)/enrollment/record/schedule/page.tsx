'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useTeacherScheduleRecordQueryByCategory } from '@/lib/queries/teacherScheduleRecord/get/category';
import LoaderPage from '@/components/shared/LoaderPage';
import { useProfileQueryBySessionId } from '@/lib/queries/profile/get/session';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [teacherScheduleRecord, setTeacherScheduleRecord] = useState([]);
  const { data, isLoading, error: isEnError } = useTeacherScheduleRecordQueryByCategory('College');
  const { data: pData, error: pError } = useProfileQueryBySessionId();

  useEffect(() => {
    if (isEnError || !data) return;
    if (pError || !pData) return;

    if (data && pData) {
      const a = data?.teacherScheduleRecords?.filter((s: any) => s.course.name.toLowerCase() === pData?.profile.courseId.name.toLowerCase()  && s.course.courseCode.toLowerCase()  === pData?.profile.courseId.courseCode.toLowerCase() );
      setTeacherScheduleRecord(a);

      setIsPageLoading(false);
    }
  }, [data, isEnError, pError, pData]);

  return (
    <>
      {isPageLoading ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>
          <LoaderPage />
        </div>
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          {data?.error && data?.status === 404 && <div className=''>404</div>}
          {data?.error && data?.status > 500 && <div className=''>Something Went Wrong</div>}
          {data?.teacherScheduleRecords && !data.error && (
            <div className=''>
              <div className='flex items-center py-4 text-black w-full justify-center'>
                <h1 className='sm:text-3xl text-xl font-semibold tracking-tight '>Schedule&apos;s Records</h1>
              </div>
              <DataTable columns={columns} data={teacherScheduleRecord as any[]} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
