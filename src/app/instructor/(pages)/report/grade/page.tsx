'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import LoaderPage from '@/components/shared/LoaderPage';
import { useProfileQueryBySessionId } from '@/lib/queries/profile/get/session';
import { useReportGradeQueryByTeacherId } from '@/lib/queries/reportGrade/get/teacherId';
import OptionsExport from './components/OptionsExport';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const { data: pData, isLoading: pload, error } = useProfileQueryBySessionId();
  const { data, isLoading, error: isEnError } = useReportGradeQueryByTeacherId(pData?.profile?._id as string);

  useEffect(() => {
    if (isEnError || !data) return;
    if (error || !pData) return;

    if (data && pData) {
      if (pData.profile) {
        setIsPageLoading(false);
      } else if (pData.error) {
        setIsError(true);
        setIsPageLoading(false);
      }
    }
  }, [data, isEnError, pData, error]);

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
                <h1 className='sm:text-3xl text-xl font-bold '>Your Grades Report Management</h1>
              </div>
              <DataTable columns={columns} data={data.reportGrades as any[]} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
