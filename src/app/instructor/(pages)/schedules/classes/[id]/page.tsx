'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import AddGrades from './components/AddGrades';
import LoaderPage from '@/components/shared/LoaderPage';
import { useProfileQueryBySessionId } from '@/lib/queries/profile/get/session';
import { useTeacherScheduleQueryById } from '@/lib/queries/teacherSchedule/get/id';
import { useEnrollmentQueryByTeacherScheduleId } from '@/lib/queries/enrollment/get/teacherSchedule';
import { useEnrollmentSetupQuery } from '@/lib/queries';
import { useReportGradeQueryByTeacherId } from '@/lib/queries/reportGrade/get/teacherId';

const Page = ({ params }: { params: { id: string } }) => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const { data, isLoading, error: isEnError } = useProfileQueryBySessionId();
  const { data: rgData, isLoading: rpLoading, error: rgError } = useReportGradeQueryByTeacherId(data?.profile?._id as string);
  const { data: ts, isLoading: tsLoading, error: tsError } = useTeacherScheduleQueryById(params.id, 'College');
  const { data: s, isLoading: sLoading, error: sError } = useEnrollmentQueryByTeacherScheduleId({ id: ts?.teacherSchedule?._id, category: 'College' });
  const { data: esData, isLoading: esLoading, isError: esError } = useEnrollmentSetupQuery();

  useEffect(() => {
    if (tsError || !ts) return;
    if (isEnError || !data) return;
    if (sError || !s) return;
    if (esError || !esData) return;
    if (rgError || !rgData) return;

    if (ts && data && s) {
      if (ts.teacherSchedule) {
        if (s.students) {
          setIsPageLoading(false);
        } else if (s.error) {
          setIsError(true);
          setIsPageLoading(false);
        }
      } else if (ts.error) {
        setIsError(true);
        setIsPageLoading(false);
      }
    }
    console.log('rgData', rgData);
  }, [ts, tsError, data, isEnError, s, sError, esData, esError, rgData, rgError]);

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
              <div className='flex items-center py-4 text-black text-center flex-col mb-7'>
                <div className='mb-3'>
                  <h1 className='text-lg sm:text-2xl font-bold uppercase'>Instructor&apos;s Students</h1>
                </div>
                <div className='grid sm:grid-cols-2 grid-cols-1 items-start w-full gap-y-1'>
                  <div className='justify-between items-center flex w-full'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Fullname:{' '}
                      <span className='font-normal'>
                        {ts?.teacherSchedule?.profileId.firstname} {ts?.teacherSchedule?.profileId.middlename ?? ''} {ts?.teacherSchedule?.profileId.lastname} {ts?.teacherSchedule?.profileId.extensionName ? ts?.teacherSchedule?.profileId.extensionName + '.' : ''}
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
                      {esData && esData.enrollmentSetup?.enrollmentTertiary?.firstGrade.open && <AddGrades data={s.students} teacher={ts?.teacherSchedule} type={'firstGrade'} reportGrades={rgData?.reportGrades} />}
                      {esData && esData.enrollmentSetup?.enrollmentTertiary?.secondGrade.open && <AddGrades data={s.students} teacher={ts?.teacherSchedule} type={'secondGrade'} reportGrades={rgData?.reportGrades} />}
                      {esData && esData.enrollmentSetup?.enrollmentTertiary?.thirdGrade.open && <AddGrades data={s.students} teacher={ts?.teacherSchedule} type={'thirdGrade'} reportGrades={rgData?.reportGrades} />}
                      {esData && esData.enrollmentSetup?.enrollmentTertiary?.fourthGrade.open && <AddGrades data={s.students} teacher={ts?.teacherSchedule} type={'fourthGrade'} reportGrades={rgData?.reportGrades} />}
                    </div>
                  </div>
                  <DataTable columns={columns} data={s.students} />{' '}
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
