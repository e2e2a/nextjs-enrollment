'use client';
import Loader from '@/components/shared/Loader';
import React, { useEffect, useState } from 'react';
import { useCreateStudentCurriculumMutation, useCurriculumQueryByCourseId, useSchoolYearQuery, useStudentCurriculumQueryByStudentId, useSubjectCollegeQuery } from '@/lib/queries';
import ErrorPage from './components/ErrorPage';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/Icons';
import AddForm from './components/AddForm';
import CurriculumTable from './components/CurriculumTable';

const Page = ({ params }: { params: { id: string } }) => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isPageError, setIsPageError] = useState(false);
  
  const { data, isLoading, error: isEnError } = useStudentCurriculumQueryByStudentId(params.id);
  const { data:syData, isLoading:syLoading, error: syError } = useSchoolYearQuery();
  const { data: sData, isLoading: sLoading, error: sError } = useCurriculumQueryByCourseId(data?.curriculum?.courseId._id);
  const mutation = useCreateStudentCurriculumMutation();
  useEffect(() => {
    if (params.id.length === 24) {
      if (isLoading || !data) return;
      if (isEnError) return;
      if (data) {
        setIsPageLoading(false);
      }
    } else {
      setIsPageError(true);
    }
  }, [data, isLoading, isEnError,params]);
  useEffect(() => {
      if (syLoading || !syData) return;
      if (syError) return;
      if (syData) {
        setIsPageLoading(false);
      }
  }, [syData, syLoading, syError]);
  useEffect(() => {
    if (sLoading || !sData) return;
    if (sError) console.log(sError);
    if (sData) {
      console.log('meow');
    }
  }, [sData, sLoading, sError]);
  const actionFormSubmit = () => {
    const data = {
      studentId: params.id,
    };
    mutation.mutate(data, {
      onSuccess: (res: any) => {
        console.log(res);
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            // return (window.location.href = '/');
            return;
          default:
            return;
        }
      },
      onSettled: () => {},
    });
  };
  return (
    <>
      {isPageLoading ? (
        <Loader />
      ) : isPageError ? (
        <ErrorPage />
      ) : data && data.error === 'not found' ? (
        // <ErrorPage />
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          <div className='flex items-center py-4 text-black w-full text-center'>
            <h1 className='sm:text-3xl text-xl font-bold w-full uppercase text-center'>Student Curriculum not found</h1>
          </div>
          <div className='flex items-center justify-center'>
            <span className=''>
              <span className='text-orange-500'>Note:</span> Course will automatically bind where the student enrolled/enrolling
            </span>
          </div>
          <div className=' w-full flex items-center justify-center'>
            <Button
              size={'sm'}
              onClick={() => {
                actionFormSubmit();
              }}
              className={'focus-visible:ring-0 flex mb-7 bg-transparent bg-green-500 px-2 py-0 gap-x-1 justify-center text-neutral-50 font-medium'}
            >
              <Icons.add className='h-4 w-4' />
              <span className='flex'>Create Student Curriculum </span>
            </Button>
          </div>
        </div>
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          <div className='flex items-center py-4 text-black w-full text-center'>
            <h1 className='sm:text-3xl text-xl font-bold w-full uppercase text-center'>{data?.curriculum?.courseId?.name}</h1>
          </div>
          <div className=' w-full flex items-center justify-center'>
            {/* <Button type='button' size={'sm'} className='bg-green-500 text-white flex gap-1 px-2'>
              <Icons.add className='w-4 h-4' /> Add New
            </Button> */}
            <AddForm c={data?.curriculum} syData={syData?.sy} />
          </div>
          <div className=''>
            <CurriculumTable data={data?.curriculum} s={sData?.curriculum?.curriculum} />
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
