'use client';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useSubjectCollegeQuery, useTeacherScheduleCollegeQuery, useTeacherScheduleCollegeQueryById } from '@/lib/queries';
import { ITeacherSchedule } from '@/types';

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
const Page = ({ params }: { params: { id: string } }) => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  // Query data based on the validated step parameter
  const { data, isLoading, error: isEnError } = useTeacherScheduleCollegeQueryById(params.id);

  useEffect(() => {
    if (isLoading || !data) return;
    if (isEnError) console.log(isEnError.message);
    if (data) console.log('courses logs:', data.teacherSchedule);
    if (data.teacherSchedule) {
      // setSubjects(data.teacherSchedules);
      console.log('data:', data.teacherSchedule);
      setIsPageLoading(false);
    }
  }, [data, isLoading, isEnError]);

  return (
    <>
      {isPageLoading ? (
        <Loader />
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>{isError ? <div className=''>404</div> : data && data.teacherSchedule && <DataTable columns={columns} data={data?.teacherSchedule?.schedule} />}</div>
      )}
    </>
  );
};

export default Page;
