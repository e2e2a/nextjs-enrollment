'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import LoaderPage from '@/components/shared/LoaderPage';
import { useStudentReceiptQueryByUserId } from '@/lib/queries/studentReceipt/get/userId';
import { useSession } from 'next-auth/react';

const Page = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [studentReceipt, setStudentReceipt] = useState([]);
  const { data: s } = useSession();
  const { data, error } = useStudentReceiptQueryByUserId(s?.user?.id as string);

  useEffect(() => {
    if (error || !data) return;
    if (data) {
      if (data.studentReceipt) {
        const a = data.studentReceipt.filter((sr: any) => !sr?.isPaidIn?.year && !sr?.isPaidIn?.semester);
        setStudentReceipt(a);
      }
      setIsPageLoading(false);
    }
  }, [data, error]);

  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          {data?.error && data?.status === 404 && <div className=''>404</div>}
          {data?.error && data?.status > 500 && <div className=''>Something Went Wrong</div>}
          {data?.studentReceipt && !data.error && (
            <div className=''>
              <div className='flex items-center py-4 text-black w-full justify-center'>
                <h1 className='sm:text-3xl text-xl font-bold '>Your Payment Receipts</h1>
              </div>
              <DataTable columns={columns} data={studentReceipt as []} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
