'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import LoaderPage from '@/components/shared/LoaderPage';
import { useStudentReceiptQueryByUserId } from '@/lib/queries/studentReceipt/get/userId';
import { useSession } from 'next-auth/react';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const { data: s } = useSession();
  const { data, isLoading, error } = useStudentReceiptQueryByUserId(s?.user?.id as string);

  useEffect(() => {
    if (error || !data) return setIsError(true);
    if (data) {
      setIsError(false);
      if (data.studentReceipt) {
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
                <h1 className='sm:text-3xl text-xl font-bold '>Your Payment Receipt</h1>
              </div>
              <DataTable columns={columns} data={data.studentReceipt} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
