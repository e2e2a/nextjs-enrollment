'use client';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAllEnrollmentByTeacherScheduleIdQuery, useTeacherProfileQueryByUserId, useTeacherScheduleCollegeQueryById } from '@/lib/queries';
import { useSession } from 'next-auth/react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import AddGrades from './components/AddGrades';

const Page = ({ params }: { params: { id: string } }) => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data: session } = useSession();
  const { data, isLoading, error: isEnError } = useTeacherProfileQueryByUserId(session?.user?.id!);
  const { data: ts, isLoading: tsLoading, error: tsError } = useTeacherScheduleCollegeQueryById(params.id);
  const { data: s, isLoading: sLoading, error: sError } = useAllEnrollmentByTeacherScheduleIdQuery(ts?.teacherSchedule?._id);
  useEffect(() => {
    if (isLoading || !data) return;
    if (isEnError) setIsError(true);
  }, [data, isLoading, isEnError]);
  useEffect(() => {
    if (tsLoading || !ts) return;
    if (tsError) setIsError(true);
  }, [ts, tsLoading, tsError]);
  useEffect(() => {
    if (sLoading || !s) return;
    if (sError) setIsError(true);
  }, [s, sLoading, sError]);
  useEffect(() => {
    if (ts && data && s) {
      setIsPageLoading(false);
      console.log(s?.enrollment)
    }
  }, [ts, data,s]);

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
                  <h1 className='xs:text-lg sm:text-xl font-bold uppercase'>Instructor Students</h1>
                  <h1 className='xs:text-lg sm:text-xl text-sm font-bold uppercase'>{ts?.teacherSchedule?.courseId?.name}</h1>
                  <h1 className='text-[12px] xs:text-sm sm:text-lg font-semibold uppercase'>SUBJECT: {ts?.teacherSchedule?.subjectId?.name}</h1>
                  <h1 className='text-[12px] xs:text-sm sm:text-lg font-semibold uppercase'>{ts?.teacherSchedule?.blockTypeId?.year} - {ts?.teacherSchedule?.blockTypeId?.semester}</h1>
                  <span className='text-[12px] xs:text-sm sm:text-lg font-semibold uppercase'>BLOCK {ts?.teacherSchedule?.blockTypeId.section} | </span>
                  <span className='text-[12px] xs:text-sm sm:text-lg font-semibold'>
                    {ts?.teacherSchedule?.startTime} - {ts?.teacherSchedule?.endTime} |
                  </span>
                  <span className='text-[12px] xs:text-sm sm:text-lg font-semibold'> {ts?.teacherSchedule?.roomId.roomName}</span>
                </div>
              </div>
              <div className='w-full flex justify-start items-center'>
                <div className='flex flex-col'><AddGrades data={s?.enrollment} teacher={ts?.teacherSchedule}/></div>
              </div>
              <DataTable columns={columns} data={s?.enrollment} />
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
