'use client';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import AddBlockSched from './components/AddBlockSched';
import { useBlockCourseQueryById } from '@/lib/queries/blocks/get/id';
import { useTeacherScheduleQueryByCategory } from '@/lib/queries/teacherSchedule/get/category';

const Page = ({ params }: { params: { id: string } }) => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [teachersSchedules, setTeachersSchedules] = useState<any>([]);
  const { data, isLoading, error: isEnError } = useBlockCourseQueryById(params.id);
  const { data: s, isLoading: sLoading, error: sError } = useTeacherScheduleQueryByCategory('College');

  useEffect(() => {
    if (isEnError || !data) return;
    if (sError || !s) return;
    
    if (s && data) {
      const filteredSchedules = s?.teacherSchedules?.filter((schedule: any) => schedule.blockTypeId === null && !schedule.blockTypeId);
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
                <div>
                  <h1 className='sm:text-lg text-xl font-bold uppercase'>Block {data.blockType.section}</h1>
                </div>
                <div className=''>
                  <h1 className='sm:text-sm text-lg font-bold'>
                    {data.blockType.year} - {data.blockType.semester}
                  </h1>
                </div>
              </div>
              <div className='w-full flex justify-end items-center'>
                <AddBlockSched blockType={data} s={s?.teacherSchedules} />
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
