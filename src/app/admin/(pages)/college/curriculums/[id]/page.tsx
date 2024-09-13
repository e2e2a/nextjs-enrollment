'use client';
import Loader from '@/components/shared/Loader';
import React, { useEffect, useState } from 'react';
import { useProspectusQueryById, useSchoolYearQuery, useSubjectCollegeQuery } from '@/lib/queries';
import ErrorPage from './components/ErrorPage';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/Icons';
import AddForm from './components/AddForm';
import CurriculumTable from './components/CurriculumTable';

const Page = ({ params }: { params: { id: string } }) => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isPageError, setIsPageError] = useState(false);
  const { data, isLoading, error: isEnError } = useProspectusQueryById(params.id);
  const { data:sData, isLoading: sLoading, error: sError } = useSubjectCollegeQuery();
  useEffect(() => {
    if (params.id.length === 24) {
      if (isLoading || !data) return;
      if (isEnError) console.log(isEnError);
      if (data) {
        setIsPageLoading(false);
      }
    } else {
      setIsPageError(true);
    }
  }, [data, isLoading, isEnError,params]);
  useEffect(() => {
      if (sLoading || !sData) return;
      if (sError) console.log(sError);
      if (sData) {
        console.log('meow')
      }
    
  }, [sData, sLoading, sError]);


  return (
    <>
      {isPageLoading ? (
        <Loader />
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
            <AddForm c={data?.curriculum}/>
          </div>
          <div className="">
            <CurriculumTable data={data?.curriculum} s={sData?.subjects} />
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
