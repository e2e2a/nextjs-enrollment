'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useSession } from 'next-auth/react';
import { useProfileQueryBySessionId } from '@/lib/queries/profile/get/session';
import { useTeacherScheduleQueryByProfileId } from '@/lib/queries/teacherSchedule/get/all/profileId';
import LoaderPage from '@/components/shared/LoaderPage';
import { Button } from '@/components/ui/button';
import { exportToPDF } from './components/ExportUtils';
import { Icons } from '@/components/shared/Icons';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data, error: isEnError } = useProfileQueryBySessionId();
  const { data: ts, error: tsError } = useTeacherScheduleQueryByProfileId({ id: data?.profile?._id });

  useEffect(() => {
    if (tsError || !ts) return;
    if (isEnError || !data) return;

    if (ts && data) {
      if (ts.error) {
        setIsPageLoading(false);
        setIsError(true);
        return;
      }
      setIsPageLoading(false);
    }
  }, [ts, tsError, data, isEnError]);

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
          ) : data && data.profile ? (
            <>
              <div className='flex items-end justify-end pt-1 text-black w-full text-center'>
                <Button
                  type='button'
                  onClick={() => exportToPDF(data, ts?.teacherSchedules, 'schedule')}
                  className='select-none focus-visible:ring-0 text-[15px] bg-none hover:bg-blue-500 text-black hover:text-neutral-100 tracking-normal font-medium font-poppins flex items-center justify-center'
                >
                  <Icons.download className='h-4 w-4 mr-1' /> Download
                </Button>
              </div>
              <div className='flex items-center py-4 text-black w-full text-center flex-col'>
                <div>
                  <h1 className='sm:text-lg text-xl font-bold uppercase'>Instructor Schedules</h1>
                </div>
                <div className=''>
                  <h1 className='sm:text-sm text-lg font-bold capitalize'>
                    {data?.profile?.firstname ?? ''} {data.profile.middlename ?? ''} {data.profile.lastname ?? ''} {data.profile.extensionName ? data.profile.extensionName + '.' : ''}
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
