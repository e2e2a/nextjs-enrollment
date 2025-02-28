'use client';
import React, { useEffect, useState } from 'react';
import ErrorPage from './components/ErrorPage';
import CurriculumTable from './components/CurriculumTable';
import LoaderPage from '@/components/shared/LoaderPage';
import { useCurriculumQueryByCourseCode } from '@/lib/queries/curriculum/get/courseCode';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/Icons';
import { exportToPDF } from './components/ExportUtils';

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
          <div className='flex items-end justify-end pt-1 pb-3 text-black w-full text-center'>
            <Button
              type='button'
              onClick={() => exportToPDF(data?.curriculum, 'curriculum')}
              className='select-none focus-visible:ring-0 text-[15px] bg-none hover:bg-blue-500 text-black hover:text-neutral-100 tracking-normal font-medium font-poppins flex items-center justify-center'
            >
              {' '}
              <Icons.download className='h-4 w-4 mr-1' /> Download
            </Button>
          </div>
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
