'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import LoaderPage from '@/components/shared/LoaderPage';
import { useScholarshipQueryByCategory } from '@/lib/queries/scholarship/get/category';

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
  const [discountedStudents, setDiscountedStudents] = useState([]);
  const { data, error } = useScholarshipQueryByCategory('College');

  useEffect(() => {
    if (error || !data) return setIsError(true);
    if (data) {
      const a = data?.scholarships.filter((s: any) => s.type === 'percentage');
      setDiscountedStudents(a);
      setIsError(false);
      setIsPageLoading(false);
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
                <h1 className='sm:text-3xl text-xl font-bold '>Student Tuition Fee Discount Management</h1>
              </div>
              <DataTable columns={columns} data={discountedStudents as []} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
