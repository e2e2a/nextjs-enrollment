'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import AddInstructorSched from './components/AddInstructorSched';
import { useAllRoomQueryByEduLevel } from '@/lib/queries/rooms/get/all';
import { useSubjectQueryByCategory } from '@/lib/queries/subjects/get/category';
import LoaderPage from '@/components/shared/LoaderPage';
import { useTeacherScheduleQueryByProfileId } from '@/lib/queries/teacherSchedule/get/all/profileId';
import { useProfileQueryByParamsUserId } from '@/lib/queries/profile/get/userId';

const Page = ({ params }: { params: { id: string } }) => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data, isLoading, error: isEnError } = useProfileQueryByParamsUserId(params.id);
  const { data: ts, isLoading: tsLoading, error: tsError } = useTeacherScheduleQueryByProfileId({ id: data?.profile?._id, role: data?.profile?.userId.role });
  console.log('id',  ts)
  const { data: s, isLoading: sLoading, error: sError } = useSubjectQueryByCategory('College');
  const { data: r, isLoading: rLoading, error: rError } = useAllRoomQueryByEduLevel('tertiary');

  useEffect(() => {
    if (tsError || !ts) return;
    if (isEnError || !data) return;
    if (sError || !s) return;
    if (rError || !r) return;
    
    if (ts && data && s && r) {
      setIsPageLoading(false);
    }
  }, [ts, tsError, data, isEnError, s, sError, r, rError]);

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
              <div className='flex items-center py-4 text-black w-full text-center flex-col'>
                <div>
                  <h1 className='sm:text-lg text-xl font-bold uppercase'>Instructor Schedules</h1>
                </div>
                <div className=''>
                  <h1 className='sm:text-sm text-lg font-bold capitalize'>
                    {data?.profile?.firstname} {data?.profile?.middlename ?? ''} {data?.profile?.lastname} {data?.profile?.extensionName ? data?.profile?.extensionName + '.' : ''}
                  </h1>
                </div>
              </div>
              <div className='w-full flex justify-end items-center'>
                <AddInstructorSched teacher={data.profile} s={s?.subjects} r={r?.rooms} />
              </div>
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
