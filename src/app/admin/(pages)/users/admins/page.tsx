'use client';
import { columns } from './components/columns';
import { useUserRolesAdminQuery, useUserRolesStudentQuery } from '@/lib/queries';
import { useEffect } from 'react';
import { DataTable } from './components/DataTable';
import { IAdminProfile } from '@/types';

export default function Page() {
  // const data = await getUsers()
  const { data: res,isLoading, error } = useUserRolesAdminQuery();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error || !res || !res.admins) {
    return <div>Error: Failed to fetch users</div>;
  }
  return (
      <div className='w-full rounded-md flex flex-col gap-4 items-center px-6 py-8 justify-center bg-white'>
        <h1 className='mb-6 text-3xl font-bold'>All Users</h1>
        {res && <DataTable columns={columns} data={res.admins as IAdminProfile[]} />}
      </div>
  );
}
