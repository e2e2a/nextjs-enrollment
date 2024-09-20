'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useBlockCourseQuery } from '@/lib/queries';
import { IBlockType } from '@/types';
import LoaderPage from '@/components/shared/LoaderPage';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data, isLoading, error } = useBlockCourseQuery();

  useEffect(() => {
    if (error || !data) return setIsError(true);
    if (data) {
      setIsError(false);
      if (data.blockTypes) {
        setIsPageLoading(false);
      }
    }
  }, [data, error]);

  return <>{isPageLoading ? <LoaderPage /> : <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>{isError ? <div className=''>404</div> : data && data.blockTypes && <DataTable columns={columns} data={data?.blockTypes as IBlockType[]} />}</div>}</>;
};

export default Page;
