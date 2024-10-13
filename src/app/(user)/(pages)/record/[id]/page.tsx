'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useAllTeacherReportGradeQuery, useStudentEnrollmentRecordByIdQuery, useStudentEnrollmentRecordByProfileIdQuery, useTeacherReportGradeQueryById } from '@/lib/queries';
import { IRoom } from '@/types';
import LoaderPage from '@/components/shared/LoaderPage';

const Page = ({ params }: { params: { id: string } }) => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [schedule, setSchedule] = useState([]);
  const { data, isLoading, error: isEnError } = useStudentEnrollmentRecordByIdQuery(params.id);
  useEffect(() => {
    if (isEnError || !data) return;
    if (data) {
      if (data.enrollmentRecord) {
        const filteredSchedules = data.enrollmentRecord?.studentSubjects?.filter((ss: any) => ss.status === 'Approved');
        setSchedule(filteredSchedules)
        setIsPageLoading(false);
      } else if(data.error) {
        setIsError(true);
        setIsPageLoading(false);
      }
    }
  }, [data, isEnError]);

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
              <div className='flex items-center py-4 text-black text-center flex-col mb-7'>
                <div className='mb-3'>
                  <h1 className='text-lg sm:text-2xl font-semibold uppercase tracking-tight'>Schedule Management Record</h1>
                </div>
                <div className='grid sm:grid-cols-2 grid-cols-1 items-start w-full gap-y-1'>
                  <div className='justify-between items-center flex w-full'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Fullname:{' '}
                      <span className='font-normal'>
                        {data?.enrollmentRecord?.profileId.firstname} {data?.enrollmentRecord?.profileId.middlename} {data?.enrollmentRecord?.profileId.lastname}{' '}
                        {data?.enrollmentRecord?.profileId.extensionName ? data?.enrollmentRecord?.profileId.extensionName + '.' : ''}
                      </span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start sm:justify-end'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Department: <span className='font-normal'>{data.enrollmentRecord.course}</span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start '>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Year:{' '}
                      <span className='font-normal'>
                        {data.enrollmentRecord.studentYear} - {data.enrollmentRecord.studentSemester}
                      </span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start sm:justify-end'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Block: <span className='font-normal'>{data.enrollmentRecord.blockType.section}</span>
                    </span>
                  </div>
                  {/* <div className='flex w-full justify-start'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>Enrollment Status: {data.enrollmentRecord.enrollStatus === 'Enrolled' && <span className='text-green-500'>{data.enrollmentRecord.enrollStatus}</span>}</span>
                  </div> */}
                </div>
              </div>
              <DataTable columns={columns} data={schedule as any[]} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
