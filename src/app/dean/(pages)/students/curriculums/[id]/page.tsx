'use client';
import React, { useEffect, useState } from 'react';
import { useCreateStudentCurriculumMutation, useSchoolYearQuery } from '@/lib/queries';
import ErrorPage from './components/ErrorPage';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/Icons';
import AddForm from './components/AddForm';
import CurriculumTable from './components/CurriculumTable';
import ViewLackingSubjects from './components/ViewLackingSubjects';
import { useCurriculumQueryByCourseId } from '@/lib/queries/curriculum/get/courseId';
import LoaderPage from '@/components/shared/LoaderPage';
import { useStudentCurriculumQueryByStudentId } from '@/lib/queries/studentCurriculum/get/studentId';

const Page = ({ params }: { params: { id: string } }) => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  const { data, isLoading, error } = useStudentCurriculumQueryByStudentId(params.id);
  const { data: syData, isLoading: syLoading, error: syError } = useSchoolYearQuery();
  const { data: sData, isLoading: sLoading, error: sError } = useCurriculumQueryByCourseId(data?.curriculum?.courseId._id ?? 'a');
  const mutation = useCreateStudentCurriculumMutation();

  useEffect(() => {
    if (error || !data) return;
    if (syError || !syData) return;

    if (sError || !sData) return;
    if (data && syData && sData) {
      setIsPageLoading(false);
    }
  }, [data, error, syData, syError, sData, sError]);

  const actionFormSubmit = () => {
    const data = { studentId: params.id };

    mutation.mutate(data, {
      onSuccess: (res: any) => {
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
      {data && data.error && data.error === 'not found' && (
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
      )}
      {data && data.error && data.error !== 'not found' && <ErrorPage />}
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        data &&
        data.curriculum && (
          <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
            <div className='flex flex-col items-center py-4 text-black w-full text-center'>
              <h1 className='sm:text-2xl text-xl font-bold w-full uppercase text-center'>
                {data?.curriculum?.studentId.lastname}, {data?.curriculum?.studentId.firstname} {data?.curriculum?.studentId.extensionName && data?.curriculum?.studentId.extensionName + '.'} {data?.curriculum?.studentId.middlename ?? ''}{' '}
              </h1>
              <h1 className='sm:text-3xl text-xl font-bold w-full uppercase text-center'>{data?.curriculum?.courseId?.name}</h1>
            </div>
            <div className=' w-full flex items-center justify-center'></div>
            <div className=' w-full flex gap-2 flex-col  sm:flex-row items-center justify-center'>
              {data?.curriculum?.curriculum.length > 0 && <ViewLackingSubjects c={data?.curriculum} sData={sData?.curriculum?.curriculum} />}
              <AddForm c={data?.curriculum} syData={syData?.sy} />
            </div>
            <div className=''>
              <CurriculumTable data={data?.curriculum} s={sData?.curriculum?.curriculum} />
            </div>
          </div>
        )
      )}
    </>
  );
};

export default Page;
