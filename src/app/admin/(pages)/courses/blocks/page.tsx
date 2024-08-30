'use client';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useBlockCourseQuery, useCourseQuery } from '@/lib/queries';

interface IBlockType {
  courseId: any;
  semester: string;
  year: string;
  section: string;
  createdAt: Date;
  updatedAt: Date;
}
const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [blocks, setBlocks] = useState({});
  // Query data based on the validated step parameter
  const { data, isLoading, error: isEnError } = useBlockCourseQuery();

  useEffect(() => {
    if (isLoading || !data || !data.blockTypes) return;
    if (isEnError) console.log(isEnError.message);
    // if (data) console.log('courses logs:', data.blockTypes);
    if (data.blockTypes) {
        setBlocks(data.blockTypes);
      setIsPageLoading(false);
    }
  }, [data, isLoading, isEnError]);

  return <>{isPageLoading ? <Loader /> : <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>{isError ? <div className=''>404</div> : <DataTable columns={columns} data={blocks as IBlockType[]} />}</div>}</>;
};

export default Page;
