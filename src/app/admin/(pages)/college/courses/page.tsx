'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import LoaderPage from '@/components/shared/LoaderPage';
import { useCourseQueryByCategory } from '@/lib/queries/courses/get/category';
import OptionsExport from './components/OptionsExport';

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
  const { data, isLoading, error: isEnError } = useCourseQueryByCategory('College');

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
              <OptionsExport data={data?.courses || []} />
              <div className='flex items-center py-4 text-black w-full justify-center'>
                <h1 className='sm:text-3xl text-xl font-bold '>Courses Management</h1>
              </div>
              <DataTable columns={columns} data={courses as ICourse[]} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
