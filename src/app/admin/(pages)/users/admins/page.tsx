'use client';
import { columns } from './components/columns';
import { useUserRolesAdminQuery } from '@/lib/queries';
import { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { IAdminProfile } from '@/types';
import LoaderPage from '@/components/shared/LoaderPage';

export default function Page() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data, isLoading, error } = useUserRolesAdminQuery();
  useEffect(() => {
    if (error || !data) return; //setError 500;
    if (data) {
      if (data.admins) {
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
          <h1 className='mb-6 text-3xl font-bold'>Admins Management</h1>
          <DataTable columns={columns} data={data?.admins as IAdminProfile[]} />
        </div>
      )}
    </>
  );
}
