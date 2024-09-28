'use client';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useRoomQuery, useSubjectCollegeQuery, useTeacherProfileQueryById, useTeacherScheduleCollegeQueryByProfileId } from '@/lib/queries';
import AddInstructorSched from './components/AddInstructorSched';

const Page = ({ params }: { params: { id: string } }) => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data, isLoading, error: isEnError } = useTeacherProfileQueryById(params.id);
  const { data: ts, isLoading: tsLoading, error: tsError } = useTeacherScheduleCollegeQueryByProfileId(data?.teacher?._id);
  const { data: s, isLoading: sLoading, error: sError } = useSubjectCollegeQuery();
  const { data: r, isLoading: rLoading, error: rError } = useRoomQuery();

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
              <div className='w-full flex justify-end items-center'>
                <AddInstructorSched teacher={data.teacher} s={s?.subjects} r={r?.rooms} />
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
