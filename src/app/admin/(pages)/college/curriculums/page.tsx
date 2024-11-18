'use client';
import Loader from '@/components/shared/Loader';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { ICurriculum } from '@/types';
import { useCurriculumQueryByCategory } from '@/lib/queries/curriculum/get/category';

const Page = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  const { data, isLoading, error } = useCurriculumQueryByCategory('College');

  useEffect(() => {
    if (error || !data) return;

    if (data) return setIsPageLoading(false);
  }, [data, error]);

  return (
    <>
      {isPageLoading ? (
        <Loader />
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          <div className='flex items-center py-4 text-black w-full text-center'>
            <h1 className='sm:text-3xl text-xl font-semibold tracking-tight uppercase w-full text-center'>College Curriculum Management</h1>
          </div>
          <DataTable columns={columns} data={data?.curriculums as ICurriculum[]} />
        </div>
      )}
    </>
  );
};

export default Page;
