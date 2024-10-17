'use client';
import React, { useEffect, useState } from 'react';
import { useAllEnrollmentByTeacherScheduleIdQuery, useTeacherProfileQueryByUserId, useTeacherScheduleCollegeQueryById } from '@/lib/queries';
import { useSession } from 'next-auth/react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import AddGrades from './components/AddGrades';
import LoaderPage from '@/components/shared/LoaderPage';

const Page = ({ params }: { params: { id: string } }) => {
  const [isError, setIsError] = useState(false);
  const [teacherStudents, setTeacherStudents] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data: session } = useSession();
  const { data, isLoading, error: isEnError } = useTeacherProfileQueryByUserId(session?.user?.id!);
  const { data: ts, isLoading: tsLoading, error: tsError } = useTeacherScheduleCollegeQueryById(params.id);
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
              <div className='flex items-center py-4 text-black text-center flex-col mb-7'>
                <div className='mb-3'>
                  <h1 className='text-lg sm:text-2xl font-bold uppercase'>Instructor&apos;s Students</h1>
                </div>
                <div className='grid sm:grid-cols-2 grid-cols-1 items-start w-full gap-y-1'>
                  <div className='justify-between items-center flex w-full'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Fullname:{' '}
                      <span className='font-normal'>
                        {ts?.teacherSchedule?.profileId.firstname} {ts?.teacherSchedule?.profileId.middlename} {ts?.teacherSchedule?.profileId.lastname} {ts?.teacherSchedule?.profileId.extensionName ? ts?.teacherSchedule?.profileId.extensionName : ''}
                      </span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start sm:justify-end'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Department: <span className='font-normal'>{ts?.teacherSchedule?.courseId?.name}</span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start '>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      SUBJECT: <span className='font-normal'>{ts?.teacherSchedule?.subjectId?.name}</span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start sm:justify-end'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Block: <span className='font-normal'>{ts?.teacherSchedule?.blockTypeId?.section ? ts?.teacherSchedule.blockTypeId.section : 'N/A'}</span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Year:{' '}
                      <span className='font-normal'>
                        {ts?.teacherSchedule?.blockTypeId?.year} - {ts?.teacherSchedule?.blockTypeId?.semester}
                      </span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start  sm:justify-end'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Time:{' '}
                      <span className='font-normal'>
                        {ts?.teacherSchedule?.startTime} - {ts?.teacherSchedule?.endTime}
                      </span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Room: <span className='font-normal'>{ts?.teacherSchedule?.roomId.roomName}</span>
                    </span>
                  </div>
                </div>
              </div>
              {ts?.teacherSchedule?.courseId && (
                <>
                  <div className='w-full flex justify-start items-center'>
                    <div className='flex flex-col'>
                      <AddGrades data={teacherStudents} teacher={ts?.teacherSchedule} />
                    </div>
                  </div>
                  <DataTable columns={columns} data={teacherStudents} />{' '}
                </>
              )}
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
