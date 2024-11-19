'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { IStudentCurriculum } from '@/types';
import { useStudentCurriculumQueryByCategory } from '@/lib/queries/studentCurriculum/get/category';
import LoaderPage from '@/components/shared/LoaderPage';

const Page = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  const { data, isLoading, error } = useStudentCurriculumQueryByCategory('College');

  useEffect(() => {
    if (error || !data) return;

    if (data) return setIsPageLoading(false);
  }, [data, error]);

  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
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
