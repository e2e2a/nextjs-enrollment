'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useCourseQuery } from '@/lib/queries';
import LoaderPage from '@/components/shared/LoaderPage';

interface ICourse {
  id: string;
  courseCode: string;
  name: string;
  imageUrl: string;
  description?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [courses, setCourses] = useState({});
  const { data, isLoading, error: isEnError } = useCourseQuery();

  useEffect(() => {
    if (isEnError || !data) return setIsError(true);
    if (data) {
      setIsError(false);
      if (data.courses) {
        setCourses(data.courses);
        setIsPageLoading(false);
      }
    }
  }, [data, isLoading, isEnError]);

  return <>{isPageLoading ? <LoaderPage /> : <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>{isError ? <div className=''>404</div> : <DataTable columns={columns} data={courses as ICourse[]} />}</div>}</>;
};

export default Page;
