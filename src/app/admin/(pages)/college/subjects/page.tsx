'use client';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useSubjectCollegeQuery } from '@/lib/queries';

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

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [subjects, setSubjects] = useState({});
  // Query data based on the validated step parameter
  const { data, isLoading, error: isEnError } = useSubjectCollegeQuery();

  useEffect(() => {
    if (isLoading || !data || !data.subjects) return;
    if (isEnError) console.log(isEnError.message);
    if (data) console.log('courses logs:', data.subjects);
    if (data.subjects) {
      setSubjects(data.subjects);
      setIsPageLoading(false)
    }
  }, [data, isLoading, isEnError]);

  return <>{isPageLoading ? <Loader /> : <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>{isError ? <div className=''>404</div> : <DataTable columns={columns} data={subjects as ISubject[]} />}</div>}</>;
};

export default Page;
