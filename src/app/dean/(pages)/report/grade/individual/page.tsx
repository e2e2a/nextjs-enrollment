'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import LoaderPage from '@/components/shared/LoaderPage';
import { useReportGradeQueryByCategory } from '@/lib/queries/reportGrade/get/category';
import OptionsExport from './components/OptionsExport';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  // Query data based on the validated step parameter
  const { data, isLoading, error: isEnError } = useReportGradeQueryByCategory('College', 'Individual');

  useEffect(() => {
    if (isEnError || !data) return;
    if (data) {
      if (data.reportedGrades) {
        setIsPageLoading(false);
      }
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
              <OptionsExport data={data?.reportedGrades || []} />
              <div className='flex items-center py-4 text-black w-full justify-center'>
                <h1 className='sm:text-3xl text-xl font-bold '>Individual Grades Report Management</h1>
              </div>
              <DataTable columns={columns} data={data.reportedGrades as any[]} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
