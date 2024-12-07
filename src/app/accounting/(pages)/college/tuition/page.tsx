'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import LoaderPage from '@/components/shared/LoaderPage';
import { useTuitionFeeQueryByCategory } from '@/lib/queries/tuitionFee/get/category';

interface ITuitionFee {
  id: string;
  courseId: any;
  ratePerUnit: string;
  ratePerLab: string;
  cwtsOrNstpFee: string;
  downPayment: string;
  regOrMisc: any;
  createdAt: Date;
  updatedAt: Date;
}

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data, isLoading, error } = useTuitionFeeQueryByCategory('College');

  useEffect(() => {
    if (error || !data) return setIsError(true);
    if (data) {
      setIsError(false);
      if (data.tFees) {
        setIsPageLoading(false);
      }
    }
  }, [data, error]);

  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          {isError ? (
            <div className=''>404</div>
          ) : (
            <div className=''>
              <div className='flex items-center py-4 text-black w-full justify-center'>
                <h1 className='sm:text-3xl text-xl font-bold '>Courses Fee&apos;s Management</h1>
              </div>
              <DataTable columns={columns} data={data.tFees as ITuitionFee[]} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
