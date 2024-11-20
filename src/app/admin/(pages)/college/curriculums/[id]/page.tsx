'use client';
import React, { useEffect, useState } from 'react';
import ErrorPage from './components/ErrorPage';
import AddForm from './components/AddForm';
import CurriculumTable from './components/CurriculumTable';
import { useSubjectQueryByCategory } from '@/lib/queries/subjects/get/category';
import { useCurriculumQueryById } from '@/lib/queries/curriculum/get/id';
import LoaderPage from '@/components/shared/LoaderPage';

const Page = ({ params }: { params: { id: string } }) => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isPageError, setIsPageError] = useState(false);
  const { data, isLoading, error: isEnError } = useCurriculumQueryById(params.id);
  const { data: sData, isLoading: sLoading, error: sError } = useSubjectQueryByCategory('College');
  useEffect(() => {
    if (isEnError || !data) return;
    if (sError || !sData) return;

    if (data && sData) {
      setIsPageLoading(false);
    }
  }, [data, isEnError, sData, sError, params]);

  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : isPageError ? (
        <ErrorPage />
      ) : data && data.curriculum === null ? (
        <ErrorPage />
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
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
