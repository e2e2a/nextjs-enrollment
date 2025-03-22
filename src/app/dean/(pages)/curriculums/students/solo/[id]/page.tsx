'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { IStudentCurriculum } from '@/types';
import LoaderPage from '@/components/shared/LoaderPage';
import { useStudentCurriculumQueryByStudentId } from '@/lib/queries/studentCurriculum/get/studentId';

const Page = ({ params }: { params: { id: string } }) => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data, isLoading, error } = useStudentCurriculumQueryByStudentId(params.id);

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
            <h1 className='sm:text-3xl text-xl font-bold uppercase text-center w-full'>Student Curriculum Management</h1>
          </div>
          <DataTable columns={columns} data={data?.curriculums as IStudentCurriculum[]} studentId={params.id}/>
        </div>
      )}
    </>
  );
};

export default Page;
