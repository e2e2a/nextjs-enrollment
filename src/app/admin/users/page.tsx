'use client';
import { DataTable } from '@/components/shared/DataTable';
import { columns } from './components/columns';
import { useUserQuery } from '@/lib/queries';

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
  const { data, error } = useUserQuery();
  if (error) {
    console.error(error)
    return null
  }
  return (
    <section className=''>
      <div className='container'>
        <h1 className='mb-6 text-3xl font-bold'>All Users</h1>
        {data && <DataTable columns={columns} data={data.users as User[]} />}
      </div>
    </section>
  );
}
