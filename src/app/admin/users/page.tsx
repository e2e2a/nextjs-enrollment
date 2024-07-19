'use client';
import { DataTable } from '@/components/shared/DataTable';
import { columns } from './components/columns';
import { UseUserQuery } from '@/lib/queries';
import { useEffect } from 'react';

// async function getUsers(): Promise<User[]> {
//   const res = await fetch(
//     'https://64a6f5fc096b3f0fcc80e3fa.mockapi.io/api/users'
//   )
//   const data = await res.json()
//   return data
// }
interface User {
  id: string;
  image: string | null;
  firstname: string;
  lastname: string;
  username: string | null;
  bio: string | null;
  email: string | null;
  emailVerified: Date | null;
  role: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
}
export default function Page() {
  // const data = await getUsers()
  const { data: res,isLoading, error } = UseUserQuery();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error || !res || !res.users) {
    return <div>Error: Failed to fetch users</div>;
  }
  return (
    <section className=''>
      <div className='container'>
        <h1 className='mb-6 text-3xl font-bold'>All Users</h1>
        {res && <DataTable columns={columns} data={res.users as User[]} />}
      </div>
    </section>
  );
}
