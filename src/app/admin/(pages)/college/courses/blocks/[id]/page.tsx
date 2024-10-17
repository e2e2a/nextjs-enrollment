'use client';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useBlockCourseQuery, useBlockCourseQueryById, useTeacherScheduleCollegeQuery } from '@/lib/queries';
import AddBlockSched from './components/AddBlockSched';

const Page = ({ params }: { params: { id: string } }) => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [teachersSchedules, setTeachersSchedules] = useState<any>([]);
  const { data, isLoading, error: isEnError } = useBlockCourseQueryById(params.id);
  const { data: s, isLoading: sLoading, error: sError } = useTeacherScheduleCollegeQuery();
  
  useEffect(() => {
    if (isEnError || !data) return;
    if (sError || !s) return;

    if (s && data) {
      const filteredSchedules = s?.teacherSchedules?.filter((schedule: any) => schedule.blockTypeId === null || !schedule.blockTypeId);
      setTeachersSchedules(filteredSchedules);
      setIsPageLoading(false);
    }
  }, [s, sError, data, isEnError]);

  return (
    <>
      {isPageLoading ? (
        <Loader />
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          {isError ? (
            <div className=''>404</div>
          ) : data && data.blockType ? (
            <>
              <div className='flex items-center py-4 text-black w-full text-center flex-col'>
                <div className='justify-center items-center flex w-full'>
                  <h1 className='sm:text-2xl text-lg font-bold uppercase'>Block Scheduling</h1>
                </div>
                <div className='grid sm:grid-cols-2 grid-cols-1 items-start w-full gap-y-1'>
                  <div className='justify-between items-center flex w-full'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Department: <span className='font-normal'>{data.blockType.courseId.name}</span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start sm:justify-end'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Block: <span className='font-normal'>{data.blockType.section}</span>
                    </span>
                  </div>
                  <div className='justify-between items-center flex w-full'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Year:{' '}
                      <span className='font-normal'>
                        {data.blockType.year} - {data.blockType.semester}
                      </span>
                    </span>
                  </div>
                </div>
                {/* <div>
                  <h1 className='sm:text-2xl text-lg font-bold uppercase'>Block Scheduling</h1>
                  <h1 className='sm:text-2xl text-lg font-bold uppercase'>{data.blockType.courseId.name}</h1>
                  <h1 className='text-lg font-bold uppercase'>Block {data.blockType.section}</h1>
                </div>
                <div className=''>
                  <h1 className='sm:text-sm text-lg font-bold'>
                    {data.blockType.year} - {data.blockType.semester}
                  </h1>
                </div> */}
              </div>
              <div className='w-full flex justify-end items-center'>
                <AddBlockSched blockType={data} s={teachersSchedules} />
              </div>
              <DataTable columns={columns} data={data?.blockType.blockSubjects} />
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
