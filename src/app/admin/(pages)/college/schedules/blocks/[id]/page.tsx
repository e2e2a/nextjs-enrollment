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
  // Query data based on the validated step parameter
  const { data, isLoading, error: isEnError } = useBlockCourseQueryById(params.id);
  const { data: s, isLoading: sLoading, error: sError } = useTeacherScheduleCollegeQuery();

  useEffect(() => {
    if (isLoading || !data) return;
    if (isEnError) console.log(isEnError.message);
    // if (data) console.log('courses logs:', data);
  }, [data, isLoading, isEnError]);
  useEffect(() => {
    if (sLoading || !s) return;
    if (sError) console.log(sError.message);
  }, [s, sLoading, sError]);
  useEffect(() => {
    if (s && data) {
      // const filteredSchedules = s?.teacherSchedules?.filter((schedule: any) => schedule.blockTypeId === null && !schedule.blockTypeId);
      // setTeachersSchedules(filteredSchedules);
      setIsPageLoading(false);
    }
  }, [s, data]);

  return (
    <>
      {isPageLoading ? (
        <Loader />
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          {isError ? (
            <div className=''>404</div>
          ) : (
            data &&
            data.blockType && (
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
            )
          )}
        </div>
      )}
    </>
  );
};

export default Page;
