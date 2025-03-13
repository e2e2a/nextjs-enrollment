'use client';
import React, { useEffect, useState } from 'react';
import ErrorPage from './components/ErrorPage';
import AddForm from './components/AddForm';
import CurriculumTable from './components/CurriculumTable';
import { useSubjectQueryByCategory } from '@/lib/queries/subjects/get/category';
import { useCurriculumQueryById } from '@/lib/queries/curriculum/get/id';
import LoaderPage from '@/components/shared/LoaderPage';
import { useProfileQueryBySessionId } from '@/lib/queries/profile/get/session';
import { useCurriculumQueryByCourseId } from '@/lib/queries/curriculum/get/courseId';
import { Button } from '@/components/ui/button';
import { exportToPDF } from './components/ExportUtils';
import { Icons } from '@/components/shared/Icons';

const Page = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isPageError, setIsPageError] = useState(false);
  const { data: pData, isLoading: pload, error: pError } = useProfileQueryBySessionId();
  const { data, isLoading, error: isEnError } = useCurriculumQueryByCourseId(pData?.profile?.courseId?._id || 'e2e2a');
  const { data: sData, isLoading: sLoading, error: sError } = useSubjectQueryByCategory('College');

  useEffect(() => {
    if (isEnError || !data) return;
    if (pError || !pData) return;
    if (sError || !sData) return;

    if (data && sData && pData) {
      setIsPageLoading(false);
    }
  }, [data, isEnError, sData, sError, pError, pData]);

  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : isPageError ? (
        <ErrorPage />
      ) : data && data?.curriculum === null ? (
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
          <div className=' w-full flex items-center justify-center'>
            {/* <Button type='button' size={'sm'} className='bg-green-500 text-white flex gap-1 px-2'>
              <Icons.add className='w-4 h-4' /> Add New
            </Button> */}
            <AddForm c={data?.curriculum} />
          </div>
          <div className=''>
            <CurriculumTable data={data?.curriculum} s={sData?.subjects} />
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
