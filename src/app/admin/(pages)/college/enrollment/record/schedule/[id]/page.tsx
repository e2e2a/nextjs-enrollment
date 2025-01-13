'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import LoaderPage from '@/components/shared/LoaderPage';
import { useTeacherScheduleRecordQueryById } from '@/lib/queries/teacherScheduleRecord/get/id';

const Page = ({ params }: { params: { id: string } }) => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data, isLoading, error: isEnError } = useTeacherScheduleRecordQueryById(params.id);

  useEffect(() => {
    if (isEnError || !data) return;
    if (data) {
      if (data.teacherScheduleRecord) {
        setIsPageLoading(false);
      } else if (data.error) {
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
                  <h1 className='text-lg sm:text-2xl font-bold uppercase'>Schedule Management</h1>
                </div>
                <div className='grid sm:grid-cols-2 grid-cols-1 items-start w-full gap-y-1'>
                  <div className='justify-between items-center flex w-full'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Instructor:{' '}
                      {data?.teacherScheduleRecord?.profileId && (
                        <span className='font-normal'>
                          {data?.teacherScheduleRecord?.profileId?.firstname} {data?.teacherScheduleRecord?.profileId?.middlename ?? ''} {data?.teacherScheduleRecord?.profileId?.lastname}{' '}
                          {data?.teacherScheduleRecord?.profileId?.extensionName ? data?.teacherScheduleRecord?.profileId?.extensionName + '.' : ''}
                        </span>
                      )}
                      {data?.teacherScheduleRecord?.deanId && (
                        <span className='font-normal'>
                          {data?.teacherScheduleRecord?.deanId?.firstname} {data?.teacherScheduleRecord?.deanId?.middlename ?? ''} {data?.teacherScheduleRecord?.deanId?.lastname}{' '}
                          {data?.teacherScheduleRecord?.deanId?.extensionName ? data?.teacherScheduleRecord?.deanId?.extensionName + '.' : ''}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className='flex w-full justify-start sm:justify-end'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Department: <span className='font-normal'>{data.teacherScheduleRecord.course.name}</span>
                    </span>
                  </div>
                  <div className='justify-between items-center flex w-full'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Descriptive Title: <span className='font-normal'>{data.teacherScheduleRecord.subject.name}</span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start sm:justify-end'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Time:{' '}
                      <span className='font-normal'>
                        {data.teacherScheduleRecord.startTime} - {data.teacherScheduleRecord.endTime}
                      </span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start '>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Year:{' '}
                      <span className='font-normal'>
                        {data.teacherScheduleRecord.blockType.year} - {data.teacherScheduleRecord.blockType.semester}
                      </span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start sm:justify-end'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Block: <span className='font-normal'>{data.teacherScheduleRecord.blockType.section}</span>
                    </span>
                  </div>
                </div>
              </div>
              <DataTable columns={columns} data={data.teacherScheduleRecord.studentsInClass as any[]} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
