'use client';
import Loader from '@/components/shared/Loader';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useStudentCurriculumQuery } from '@/lib/queries';
import { IStudentCurriculum } from '@/types';

const Page = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  const { data, isLoading, error: isEnError } = useStudentCurriculumQuery();

  useEffect(() => {
    setIsPageLoading(false);
    if (isLoading || !data || !data.curriculums) return;
    if (isEnError) console.log(isEnError.message);
    if (data) {
      console.log('courses logs:', data.curriculums);
    }
  }, [data, isLoading, isEnError, isPageLoading]);

  return (
    <>
      {isPageLoading ? (
        <Loader />
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          <div className='flex items-center py-4 text-black w-full text-center'>
            <h1 className='sm:text-3xl text-xl font-bold'>College Student Curriculum Management</h1>
          </div>
          <DataTable columns={columns} data={data?.curriculums as IStudentCurriculum[]} />
        </div>
      )}
    </>
  );
};

export default Page;
