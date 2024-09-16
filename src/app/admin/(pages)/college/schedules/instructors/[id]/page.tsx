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
    if (isLoading || !data) return;
    if (isEnError) console.log(isEnError.message);
    // if (data) console.log('courses logs:', data);
  }, [data, isLoading, isEnError]);
  useEffect(() => {
    if (tsLoading || !ts) return;
    if (tsError) console.log(tsError.message);
  }, [ts, tsLoading, tsError]);
  useEffect(() => {
    if (sLoading || !s) return;
    if (sError) console.log(sError.message);
  }, [s, sLoading, sError]);
  useEffect(() => {
    if (rLoading || !r) return;
    if (rError) console.log(rError.message);
  }, [r, rLoading, rError]);
  useEffect(() => {
    if (ts && data && s) {
      setIsPageLoading(false);
    }
  }, [ts, data, s]);

  return (
    <>
      {isPageLoading ? (
        <Loader />
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
                {/* <AddInstructorSched blockType={data} s={s?.teacherSchedules} /> */}
                <AddInstructorSched teacher={data.teacher} s={s?.subjects} r={r?.rooms} />
              </div>
              {/* <DataTable columns={columns} data={data?.blockType.blockSubjects} /> */}
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
