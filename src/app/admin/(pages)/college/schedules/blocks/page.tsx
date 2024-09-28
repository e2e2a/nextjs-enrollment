'use client';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useBlockCourseQuery } from '@/lib/queries';
import { IBlockType } from '@/types';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const { data, isLoading, error: isEnError } = useBlockCourseQuery();

  useEffect(() => {
    if (isLoading || !data) return;
    if (isEnError) console.log(isEnError.message);
    if (data) setIsPageLoading(false);
    if (data.blockTypes) {
      // setSubjects(data.teacherSchedules);
      setIsPageLoading(false);
    }
  }, [data, isLoading, isEnError]);

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
          ) : (
            data &&
            data.blockTypes && (
              <div className=''>
                <div className='flex items-center py-4 text-black w-full justify-center'>
                  <h1 className='sm:text-3xl text-xl font-bold '>Blocks Management</h1>
                </div>
                <DataTable columns={columns} data={data?.blockTypes as IBlockType[]} />
              </div>
            )
          )}
        </div>
      )}
    </>
  );
};

export default Page;
