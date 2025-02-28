'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import LoaderPage from '@/components/shared/LoaderPage';
import { useReportGradeQueryById } from '@/lib/queries/reportGrade/get/id';
import OptionsExport from './components/OptionsExport';

const Page = ({ params }: { params: { id: string } }) => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data, isLoading, error: isEnError } = useReportGradeQueryById(params.id);

  useEffect(() => {
    if (isEnError || !data) return;
    if (data) {
      if (data.reportedGrades) {
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
              <OptionsExport data={data?.reportedGrades || []} />
              <div className='flex items-center py-4 text-black text-center flex-col mb-7'>
                <div className='mb-3'>
                  <h1 className='text-lg sm:text-2xl font-bold uppercase'>Grade Reported Management</h1>
                </div>
                <div className='grid sm:grid-cols-2 grid-cols-1 items-start w-full gap-y-1'>
                  <div className='justify-between items-center flex w-full'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Instructor:{' '}
                      <span className='font-normal'>
                        {data?.reportedGrades?.teacherId?.firstname ?? ''} {data?.reportedGrades?.teacherId?.middlename ?? ''} {data?.reportedGrades?.teacherId?.lastname ?? ''}{' '}
                        {data?.reportedGrades?.teacherId?.extensionName ? data?.reportedGrades?.teacherId?.extensionName + '.' : ''}
                      </span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start sm:justify-end'>
                    <span className='text-sm sm:text-[17px] font-bold'>
                      Department: <span className='font-normal'>{data?.reportedGrades?.teacherScheduleId?.courseId?.name}</span>
                    </span>
                  </div>
                  <div className='justify-between items-center flex w-full'>
                    <span className='text-sm sm:text-[17px] font-bold'>
                      Descriptive Title: <span className='font-normal'>{data?.reportedGrades?.teacherScheduleId?.subjectId?.name}</span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start sm:justify-end'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Time:{' '}
                      <span className='font-normal'>
                        {data.reportedGrades.teacherScheduleId.startTime} - {data?.reportedGrades?.teacherScheduleId?.endTime}
                      </span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start '>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Year:{' '}
                      <span className='font-normal'>
                        {data?.reportedGrades?.teacherScheduleId?.blockTypeId?.year} - {data?.reportedGrades?.teacherScheduleId?.blockTypeId?.semester}
                      </span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start sm:justify-end'>
                    <span className='text-sm sm:text-[17px] font-bold'>
                      Block: <span className='font-normal'>{data?.reportedGrades?.teacherScheduleId?.blockTypeId?.section}</span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Type:
                      <span className='font-normal'>
                        {' '}
                        {data.reportedGrades.type === 'firstGrade' && 'Prelim'}
                        {data.reportedGrades.type === 'secondGrade' && 'Midterm'}
                        {data.reportedGrades.type === 'thirdGrade' && 'Semi-final'}
                        {data.reportedGrades.type === 'fourthGrade' && 'Final'}
                        {''} Grade
                      </span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start sm:justify-end'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Status:
                      <span className='font-normal text-sm text-green-500 uppercase'> {data?.reportedGrades?.statusInDean}</span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Evaluated:
                      <span className='font-normal text-sm uppercase'> {data?.reportedGrades?.evaluated ? <span className=' text-green-500'>True</span> : <span className=' text-blue-500'>False</span>}</span>
                    </span>
                  </div>
                </div>
              </div>
              <DataTable columns={columns} data={data?.reportedGrades?.reportedGrade as any[]} rp={data?.reportedGrades} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
