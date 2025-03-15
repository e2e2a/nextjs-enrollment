'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { ISubject } from '@/types';
import { useSubjectQueryByCategory } from '@/lib/queries/subjects/get/category';
import LoaderPage from '@/components/shared/LoaderPage';
import OptionsExport from './components/OptionsExport';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [subjects, setSubjects] = useState({});
  const { data, error: isEnError } = useSubjectQueryByCategory('College');

  useEffect(() => {
    if (isEnError || !data) return;

    if (data) {
      if (data.subjects) {
        const a = data.subjects.filter((s: any) => !s?.archive);
        setSubjects(a);
      }
      setIsPageLoading(false);
    }
  }, [data, isEnError]);

  return (
    <>
      {isPageLoading ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>
          <LoaderPage />
        </div>
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          {isError ? (
            <div className=''>404</div>
          ) : (
            <div className=''>
              <OptionsExport data={subjects || []} />
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
