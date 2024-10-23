'use client';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useTeacherScheduleCollegeQueryByProfileId } from '@/lib/queries';
import { useSession } from 'next-auth/react';
import { useProfileQueryBySessionId } from '@/lib/queries/profile';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const { data: session } = useSession();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data, isLoading, error: isEnError } = useProfileQueryBySessionId();
  const { data: ts, isLoading: tsLoading, error: tsError } = useTeacherScheduleCollegeQueryByProfileId(data?.profile?._id);
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
          ) : data && data.profile ? (
            <>
              <div className='flex items-center py-4 text-black w-full text-center flex-col'>
                <div>
                  <h1 className='sm:text-lg text-xl font-bold uppercase'>Instructor Schedules</h1>
                </div>
                <div className=''>
                  <h1 className='sm:text-sm text-lg font-bold capitalize'>
                    {data.profile.firstname}, {data.profile.middlename} {data.profile.lastname} {data.profile.extensionName ? data.profile.extensionName : ''}
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
