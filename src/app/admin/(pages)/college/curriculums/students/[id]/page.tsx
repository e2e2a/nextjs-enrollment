'use client';
import React, { useEffect, useState } from 'react';
import ErrorPage from './components/ErrorPage';
import AddForm from './components/AddForm';
import CurriculumTable from './components/CurriculumTable';
import ViewLackingSubjects from './components/ViewLackingSubjects';
import { useCurriculumQueryByCourseId } from '@/lib/queries/curriculum/get/courseId';
import LoaderPage from '@/components/shared/LoaderPage';
import { useStudentCurriculumQueryById } from '@/lib/queries/studentCurriculum/get/id';
import { SchoolYear } from '@/constant/schoolYear';

const Page = ({ params }: { params: { id: string } }) => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  const { data, error } = useStudentCurriculumQueryById(params.id);
  const { data: sData, error: sError } = useCurriculumQueryByCourseId(data?.curriculum?.courseId?._id ?? 'a');

  useEffect(() => {
    if (error || !data) return;

    if (sError || !sData) return;
    if (data && sData) {
      setIsPageLoading(false);
    }
  }, [data, error, sData, sError]);

  return (
    <>
      {data && data.error && data.error !== 'not found' && <ErrorPage />}
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        data &&
        data.curriculum && (
          <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
            <div className='flex flex-col items-center py-4 text-black w-full text-center'>
              <h1 className='sm:text-2xl text-xl font-bold w-full uppercase text-center'>
                {data?.curriculum?.studentId?.lastname ? data?.curriculum?.studentId?.lastname + ',' : ''}, {data?.curriculum?.studentId?.firstname ?? ''} {data?.curriculum?.studentId?.middlename ?? ''}
                {data?.curriculum?.studentId?.extensionName && ', ' + data?.curriculum?.studentId.extensionName + '.'}{' '}
              </h1>
              <h1 className='sm:text-3xl text-xl font-bold w-full uppercase text-center'>{data?.curriculum?.courseId?.name}</h1>
            </div>
            <div className=' w-full flex items-center justify-center'></div>
            <div className=' w-full flex gap-2 flex-col  sm:flex-row items-center justify-center'>
              {data?.curriculum?.curriculum.length > 0 && <ViewLackingSubjects c={data?.curriculum} sData={sData?.curriculum?.curriculum} />}
              <AddForm c={data?.curriculum} syData={SchoolYear} />
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
