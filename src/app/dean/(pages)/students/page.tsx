'use client';
import { columns } from './components/columns';
import { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { IStudentProfile } from '@/types';
import LoaderPage from '@/components/shared/LoaderPage';
import { useProfileQueryBySessionId } from '@/lib/queries/profile/get/session';
import { useAllEnrollmentQueryByCourseId } from '@/lib/queries/enrollment/get/courseId/dean';

export default function Page() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data: res, isLoading: pLoading, error: pError } = useProfileQueryBySessionId();
  
  const { data, isLoading, error } = useAllEnrollmentQueryByCourseId(res?.profile.courseId._id);

  useEffect(() => {
    if (error || !data) return;
    if (pError || !res) return;
    if (data && res) {
      if (data.students && res.profile) {
        setIsPageLoading(false);
      }
    }
  }, [data, error, pError, res]);

  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <div className='w-full rounded-md flex flex-col gap-4 items-center px-6 py-8 justify-center bg-white'>
          <h1 className='mb-6 text-3xl font-bold'>All User Students</h1>
          <DataTable columns={columns} data={data?.students as IStudentProfile[]} />
        </div>
      )}
    </>
  );
}
