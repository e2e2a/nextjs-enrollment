'use client';
import React, { useEffect, useState } from 'react';
import ErrorPage from './components/ErrorPage';
import CurriculumTable from './components/CurriculumTable';
import LoaderPage from '@/components/shared/LoaderPage';
import { useCurriculumQueryByCourseCode } from '@/lib/queries/curriculum/get/courseCode';

const Page = ({ params }: { params: { courseCode: string } }) => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isPageError, setIsPageError] = useState(false);
  const { data, isLoading, error: isEnError } = useCurriculumQueryByCourseCode(params.courseCode);

  useEffect(() => {
    if (isEnError || !data) return;

    if (data) {
      if (data.error) setIsPageError(true);
      setIsPageLoading(false);
    }
  }, [data, isEnError, params]);

  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : isPageError ? (
        <ErrorPage />
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          <div className='flex items-center py-4 text-black w-full text-center'>
            <h1 className='sm:text-3xl text-xl font-bold w-full uppercase text-center'>{data?.curriculum?.courseId?.name}</h1>
          </div>
          <div className=' w-full flex items-center justify-center'></div>
          <div className=''>
            <CurriculumTable data={data?.curriculum} />
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
