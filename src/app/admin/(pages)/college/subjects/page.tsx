'use client';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useSubjectCollegeQuery } from '@/lib/queries';
import { ISubject } from '@/types';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [subjects, setSubjects] = useState({});
  // Query data based on the validated step parameter
  const { data, isLoading, error: isEnError } = useSubjectCollegeQuery();

  useEffect(() => {
    if (isLoading || !data || !data.subjects) return;
    if (isEnError) console.log(isEnError.message);
    if (data) console.log('courses logs:', data.subjects);
    if (data.subjects) {
      setSubjects(data.subjects);
      setIsPageLoading(false);
    }
  }, [data, isLoading, isEnError]);

  return (
    <>
      {isPageLoading ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>
          <Loader />
        </div>
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          {isError ? (
            <div className=''>404</div>
          ) : (
            <div className=''>
              <div className='flex items-center py-4 text-black w-full justify-center'>
                <h1 className='sm:text-3xl text-xl font-bold '>Subjects Management</h1>
              </div>
              <DataTable columns={columns} data={subjects as ISubject[]} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
