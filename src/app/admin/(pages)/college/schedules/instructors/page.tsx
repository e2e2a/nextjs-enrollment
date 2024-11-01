'use client';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useAllProfileQueryByUserRoles } from '@/lib/queries/profile/get/roles/admin';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data, isLoading, error: isEnError } = useAllProfileQueryByUserRoles('TEACHER');

  useEffect(() => {
    if (isEnError || !data) return;

    if (data) {
      if (data.profiles) {
        setIsPageLoading(false);
      } else if (data.error) {
        setIsError(true);
        setIsPageLoading(false);
      }
    }
  }, [data, isEnError]);

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
            data &&
            data.profiles && (
              <div className=''>
                <div className='flex items-center py-4 text-black w-full justify-center'>
                  <h1 className='sm:text-3xl text-xl font-bold '>Instructors Management</h1>
                </div>
                <DataTable columns={columns} data={data?.profiles as any[]} />
              </div>
            )
          )}
        </div>
      )}
    </>
  );
};

export default Page;
