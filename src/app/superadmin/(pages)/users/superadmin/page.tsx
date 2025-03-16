'use client';
import { columns } from './components/columns';
import { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { IAdminProfile } from '@/types';
import LoaderPage from '@/components/shared/LoaderPage';
import { useAllProfileQueryByUserRoles } from '@/lib/queries/profile/get/roles/admin';

export default function Page() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data, isLoading, error } = useAllProfileQueryByUserRoles('SUPER ADMIN');

  useEffect(() => {
    if (error || !data) return;
    if (data) {
      if (data.profiles) {
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
          <h1 className='mb-6 text-3xl font-bold'>Super Admins Management</h1>
          <DataTable columns={columns} data={data?.profiles as IAdminProfile[]} />
        </div>
      )}
    </>
  );
}
