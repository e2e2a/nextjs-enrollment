'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useAllTeacherReportGradeQuery } from '@/lib/queries';
import { IRoom } from '@/types';
import LoaderPage from '@/components/shared/LoaderPage';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [teacherRG, setTeacherRG] = useState([]);
  // Query data based on the validated step parameter
  const { data, isLoading, error: isEnError } = useAllTeacherReportGradeQuery();

  useEffect(() => {
    if (isEnError || !data) return;
    if (data) {
      if (data.reportedGrades) {
        console.log('data.reportedGrades', data.reportedGrades);
        const filteredRG = data?.reportedGrades.filter((rg: any) => rg.statusInDean === 'Approved');
        console.log('filteredRG', filteredRG)
        setTeacherRG(filteredRG);
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
              <div className='flex items-center py-4 text-black w-full justify-center'>
                <h1 className='sm:text-3xl text-xl font-bold '>Grades Report Management</h1>
              </div>
              <DataTable columns={columns} data={teacherRG as any[]} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
