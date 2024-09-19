'use client';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useTeacherProfileQueryByUserId, useTeacherScheduleCollegeQueryByProfileId } from '@/lib/queries';
import { useSession } from 'next-auth/react';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const { data: session } = useSession();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data, isLoading, error: isEnError } = useTeacherProfileQueryByUserId(session?.user?.id!);
  const { data: ts, isLoading: tsLoading, error: tsError } = useTeacherScheduleCollegeQueryByProfileId(data?.teacher?._id);
  useEffect(() => {
    if (isLoading || !data) return;
    if (isEnError) return setIsError(true);
  }, [data, isLoading, isEnError]);
  useEffect(() => {
    if (tsLoading || !ts) return;
    if (tsError) return setIsError(true);
  }, [ts, tsLoading, tsError]);

  useEffect(() => {
    if (ts && data) {
      setIsPageLoading(false);
    }
  }, [ts, data]);

  return (
    <>
      {isPageLoading ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>
          <Loader />
        </div>
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          {isError ? (
            <div className=''>404</div>
          ) : data && data.teacher ? (
            <>
              <div className='flex items-center py-4 text-black w-full text-center flex-col'>
                <div>
                  <h1 className='sm:text-lg text-xl font-bold uppercase'>Instructor Schedules</h1>
                </div>
                <div className=''>
                  <h1 className='sm:text-sm text-lg font-bold capitalize'>
                    {data.teacher.firstname} {data.teacher.middlename} {data.teacher.lastname} {data.teacher.extensionName ? data.teacher.extensionName : ''}
                  </h1>
                </div>
              </div>
              <div className='w-full flex justify-end items-center'></div>
              <DataTable columns={columns} data={ts?.teacherSchedules} />
            </>
          ) : (
            <div className=''>404</div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
