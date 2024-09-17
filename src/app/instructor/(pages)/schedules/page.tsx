'use client';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useAllTeacherProfileQuery } from '@/lib/queries';
import { ITeacherProfile } from '@/types';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data, isLoading, error: isEnError } = useAllTeacherProfileQuery();

  useEffect(() => {
    if (isLoading || !data) return;
    if (isEnError) console.log(isEnError.message);
    if (data) setIsPageLoading(false);
    // if (data.teachers) {
    //   // setSubjects(data.teacherSchedules);
    //   console.log('data:', data.teachers);
    //   setIsPageLoading(false);
    // }
  }, [data, isLoading, isEnError]);

  return (
    <>
      {isPageLoading ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>
          <Loader />
        </div>
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>{isError ? <div className=''>404</div> : data && data.teachers && <DataTable columns={columns} data={data?.teachers as ITeacherProfile[]} />}</div>
      )}
    </>
  );
};

export default Page;
