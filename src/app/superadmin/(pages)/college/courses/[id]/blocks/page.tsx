'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { IBlockType } from '@/types';
import LoaderPage from '@/components/shared/LoaderPage';
import { useBlockCourseQueryByCourseId } from '@/lib/queries/blocks/get/courseId';

const Page = ({ params }: { params: { id: string } }) => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data, isLoading, error } = useBlockCourseQueryByCourseId(params.id || 'e2e2a');

  useEffect(() => {
    if (error || !data) return setIsError(true);
    if (data) {
      setIsError(false);
      if (data.blockTypes) {
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
            data &&
            data.blockTypes && (
              <div className=''>
                <div className='flex items-center justify-center py-4 text-black'>
                  <h1 className='text-lg sm:text-3xl font-semibold tracking-wide uppercase'>{data?.blockTypes[0]?.courseId?.courseCode} Blocks </h1>
                </div>
                <DataTable columns={columns} data={data?.blockTypes as IBlockType[]} />
              </div>
            )
          )}
        </div>
      )}
    </>
  );
};

export default Page;
