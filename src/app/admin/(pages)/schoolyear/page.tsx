'use client';
import Loader from '@/components/shared/Loader';
import { useSchoolYearQuery } from '@/lib/queries';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { IEnrollment, ISchoolYear } from '@/types';
import AddForm from './components/AddForm';

const Page = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  const { data, isLoading, error: isEnError } = useSchoolYearQuery();

  useEffect(() => {
    setIsPageLoading(false);
    if (isLoading || !data || !data.sy) return;
    if (isEnError) console.log(isEnError.message);
    if (data) {
      console.log('courses logs:', data.sy);
    }
  }, [data, isLoading, isEnError, isPageLoading]);

  return (
    <>
      {isPageLoading ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>
          <Loader />
        </div>
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          <div className='flex items-center py-4 text-black w-full text-center'>
            <h1 className='sm:text-3xl text-xl font-bold'>School Year Management</h1>
          </div>
          <div className='flex items-center justify-end w-full '>
            <AddForm />
          </div>
          <DataTable columns={columns} data={data?.sy as ISchoolYear[]} />
        </div>
      )}
    </>
  );
};

export default Page;
