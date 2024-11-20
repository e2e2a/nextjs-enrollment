'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import LoaderPage from '@/components/shared/LoaderPage';
import { useSession } from 'next-auth/react';
import { useProfileQueryBySessionId } from '@/lib/queries/profile/get/session';
import { useTeacherScheduleRecordQueryByProfileId } from '@/lib/queries/teacherScheduleRecord/get/profileId';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [teacherRG, setTeacherRG] = useState([]);
  const { data: s } = useSession();
  const { data: pData, isLoading: pload, error } = useProfileQueryBySessionId();
  const { data, isLoading, error: isEnError } = useTeacherScheduleRecordQueryByProfileId(pData?.profile?._id);

  useEffect(() => {
    if (isEnError || !data) return;
    if (error || !pData) return;

    if (data && pData) {
      if (data.teacherScheduleRecord && pData.profile) {
        // const filteredRG = data?.teacherScheduleRecord.filter((rg: any) => rg.teacherId._id === pData.profile._id);
        // setTeacherRG(filteredRG);
        setIsPageLoading(false);
      }
    }
  }, [data, isEnError, pData, error]);

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
                <h1 className='sm:text-3xl text-xl font-semibold tracking-tight '>Your Schedule&apos;s Records</h1>
              </div>
              <DataTable columns={columns} data={data.teacherScheduleRecord as any[]} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
