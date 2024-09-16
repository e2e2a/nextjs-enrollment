
'use client';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useBlockCourseQuery, useSubjectCollegeQuery, useTeacherScheduleCollegeQuery } from '@/lib/queries';
import { IBlockType } from '@/types';

interface ISubject {
  id: string;
  category: string;
  subjectCode: string;
  name: string;
  lec?: string;
  lab?: string;
  unit?: string;
  createdAt: Date;
  updatedAt: Date;
}
/**
 * 
 * @Todo
 * display all the professors schedules with full name and the length array of schedules 
 */
const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  // Query data based on the validated step parameter
  const { data, isLoading, error: isEnError } = useBlockCourseQuery();

  useEffect(() => {
    if (isLoading || !data ) return;
    if (isEnError) console.log(isEnError.message);
    if (data) setIsPageLoading(false)
    if (data.blockTypes) {
      // setSubjects(data.teacherSchedules);
      console.log('data:', data.blockTypes)
      setIsPageLoading(false)
    }
  }, [data, isLoading, isEnError]);

  return <>{isPageLoading ? <Loader /> : <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>{isError ? <div className=''>404</div> : data && data.blockTypes && <DataTable columns={columns} data={data?.blockTypes as IBlockType[]} />}</div>}</>;
};

export default Page;
