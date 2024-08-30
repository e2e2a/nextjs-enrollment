'use client';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useCourseQuery } from '@/lib/queries';

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
  /**
   * create a table
   * contain image
   * contain course data
   */
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [courses, setCourses] = useState({});
  // Query data based on the validated step parameter
  const { data, isLoading, error: isEnError } = useCourseQuery();

  useEffect(() => {
    if (isLoading || !data || !data.courses) return;
    if (isEnError) console.log(isEnError.message);
    if (data) console.log('courses logs:', data.courses);
    if (data.courses) {
      setCourses(data.courses);
      setIsPageLoading(false)
    }
  }, [data, isLoading, isEnError]);

  return <>{isPageLoading ? <Loader /> : <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>{isError ? <div className=''>404</div> : <DataTable columns={columns} data={courses as ICourse[]} />}</div>}</>;
};

export default Page;
