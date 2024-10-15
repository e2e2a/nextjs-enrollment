'use client';
import { columns } from './components/columns';
import { useUserRolesStudentQuery } from '@/lib/queries';
import { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { IStudentProfile } from '@/types';
import LoaderPage from '@/components/shared/LoaderPage';

export default function Page() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data, isLoading, error } = useUserRolesStudentQuery();

  useEffect(() => {
    if (error || !data) return; //setError 500;
    if (data) {
      if (data.students) {
        setIsPageLoading(false);
      }
    }
  }, [data, error]);
  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <div className='w-full rounded-md flex flex-col gap-4 items-center px-6 py-8 justify-center bg-white'>
          <h1 className='mb-6 text-3xl font-bold'>Students Management</h1>
          <DataTable columns={columns} data={data?.students as IStudentProfile[]} />
        </div>
      )}
    </>
  );
}
