'use client';
import React, { useEffect, useState } from 'react';
import { useAllEnrollmentByTeacherScheduleIdQuery, useTeacherProfileQueryById, useTeacherProfileQueryByUserId, useTeacherScheduleCollegeQueryById } from '@/lib/queries';
import { useSession } from 'next-auth/react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import AddGrades from './components/AddGrades';
import LoaderPage from '@/components/shared/LoaderPage';

const Page = ({ params }: { params: { id: string; scheduleId: string } }) => {
  const [isError, setIsError] = useState(false);
  const [teacherStudents, setTeacherStudents] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data: session } = useSession();
  const { data, isLoading, error: isEnError } = useTeacherProfileQueryById(params.id);
  const { data: ts, isLoading: tsLoading, error: tsError } = useTeacherScheduleCollegeQueryById(params.scheduleId);
  const { data: s, isLoading: sLoading, error: sError } = useAllEnrollmentByTeacherScheduleIdQuery(ts?.teacherSchedule?._id);
  useEffect(() => {
    if (tsError || !ts) return;
    if (isEnError || !data) return;
    if (sError || !s) return;

    if (ts && data && s) {
      if (ts.teacherSchedule) {
        const mytesting = s.enrollment
          .map((ss: any) => {
            return ss.studentSubjects.filter((sss: any) => sss.teacherScheduleId._id === ts?.teacherSchedule?._id && sss.status === 'Approved');
          })
          .flat();
        /**
         * can still be .flat(Infinity)
         */
        // }).flat(Infinity);
        setTeacherStudents(mytesting);
        // mytesting.map((ss: any) => {console.log('mystes', ss)})
        setIsPageLoading(false);
      }
    }
  }, [ts, tsError, data, isEnError, s, sError]);
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
          ) : data && data.teacher ? (
            <>
              <div className='flex items-center py-4 text-black w-full text-center flex-col'>
                <div>
                  <h1 className='xs:text-lg sm:text-xl font-bold uppercase'>Instructor Students</h1>
                  <h1 className='xs:text-lg sm:text-xl text-sm font-bold uppercase'>{ts?.teacherSchedule?.courseId?.name}</h1>
                  <h1 className='text-[12px] xs:text-sm sm:text-lg font-semibold uppercase'>SUBJECT: {ts?.teacherSchedule?.subjectId?.name}</h1>
                  <h1 className='text-[12px] xs:text-sm sm:text-lg font-semibold uppercase'>
                    {ts?.teacherSchedule?.blockTypeId?.year} - {ts?.teacherSchedule?.blockTypeId?.semester}
                  </h1>
                  <span className='text-[12px] xs:text-sm sm:text-lg font-semibold uppercase'>BLOCK {ts?.teacherSchedule?.blockTypeId?.section} | </span>
                  <span className='text-[12px] xs:text-sm sm:text-lg font-semibold'>
                    {ts?.teacherSchedule?.startTime} - {ts?.teacherSchedule?.endTime} |
                  </span>
                  <span className='text-[12px] xs:text-sm sm:text-lg font-semibold'> {ts?.teacherSchedule?.roomId.roomName}</span>
                </div>
              </div>
              <div className='w-full flex justify-start items-center'>
                <div className='flex flex-col'>
                  <AddGrades data={teacherStudents} teacher={ts?.teacherSchedule} />
                </div>
              </div>
              <DataTable columns={columns} data={teacherStudents} />
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
