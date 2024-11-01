'use client';
import React, { useEffect, useState } from 'react';
import { useAllEnrollmentByTeacherScheduleIdQuery } from '@/lib/queries';
import { useSession } from 'next-auth/react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import LoaderPage from '@/components/shared/LoaderPage';
import { useTeacherScheduleQueryById } from '@/lib/queries/teacherSchedule/get/id';

const Page = ({ params }: { params: { id: string } }) => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data: session } = useSession();
  const { data: ts, isLoading: tsLoading, error: tsError } = useTeacherScheduleQueryById(params.id, 'College');
  const { data: s, isLoading: sLoading, error: sError } = useAllEnrollmentByTeacherScheduleIdQuery(ts?.teacherSchedule?._id);
  useEffect(() => {
    if (tsError || !ts) return;
    if (sError || !s) return;

    if (ts && s) {
      if (ts.teacherSchedule) {
        setIsPageLoading(false);
      }
    }
  }, [ts, tsError, s, sError]);

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
          ) : ts && ts.teacherSchedule ? (
            <div className=''>
              <div className='flex items-center py-4 text-black w-full text-center flex-col'>
                <div>
                  <h1 className='xs:text-lg sm:text-xl font-bold uppercase'>Instructor Students</h1>
                  <h1 className='xs:text-lg sm:text-xl text-sm font-bold uppercase'>{ts?.teacherSchedule?.courseId?.name}</h1>
                  <h1 className='text-[12px] xs:text-sm sm:text-lg font-semibold uppercase'>SUBJECT: {ts?.teacherSchedule?.subjectId?.name}</h1>
                  <h1 className='text-[12px] xs:text-sm sm:text-lg font-semibold uppercase'>
                    {ts?.teacherSchedule?.blockTypeId?.year} - {ts?.teacherSchedule?.blockTypeId?.semester}
                  </h1>
                  <span className='text-[12px] xs:text-sm sm:text-lg font-semibold uppercase'>BLOCK {ts?.teacherSchedule?.blockTypeId.section} | </span>
                  <span className='text-[12px] xs:text-sm sm:text-lg font-semibold'>
                    {ts?.teacherSchedule?.startTime} - {ts?.teacherSchedule?.endTime} |
                  </span>
                  <span className='text-[12px] xs:text-sm sm:text-lg font-semibold'> {ts?.teacherSchedule?.roomId.roomName}</span>
                </div>
              </div>
              <DataTable columns={columns} data={s?.enrollment} />
            </div>
          ) : (
            <div className=''>404</div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
