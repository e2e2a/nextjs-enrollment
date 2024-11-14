'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ActionsCell from './ActionsCell';
import { ITeacherProfile } from '@/types';

export const columns: ColumnDef<ITeacherProfile>[] = [
  {
    accessorFn: (row) => '#',
    id: '#',
    header: '#',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {row.index + 1}
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='capitalize'>
          {user.lastname && user.firstname ? `${user.firstname} ${user.middlename} ${user.lastname} ${user.extensionName ? user.extensionName + '.' : ''}` : 'Unknown'}
        </div>
      );
    },
    accessorFn: (row) => {
      const { lastname, firstname, middlename, extensionName } = row;
      return `${firstname ?? ''} ${middlename ?? ''} ${lastname ?? ''} ${extensionName ?? ''}`.trim();
    },
    filterFn: (row, columnId, filterValue) => {
      const user = row.original;
      const fullName = `${row.original.firstname ?? ''} ${row.original.middlename ?? ''} ${row.original.lastname ?? ''} ${row.original.extensionName ?? ''}`.toLowerCase().trim();
      return fullName.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorFn: (row) => row.sex,
    id: 'sex',
    header: 'Sex',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.sex}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.userId.email,
    id: 'email',
    header: 'Email',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user.userId.email}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.isVerified,
    id: 'ProfileVerified',
    header: 'Profile Verified',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.isVerified ? <span className='text-green-500'>TRUE</span> : <span className='text-red'>FALSE</span>}
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'CreatedAt',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      const formatted = date.toLocaleDateString();

      return <div className='font-medium'>{formatted}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original;

      return <ActionsCell user={user} />;
    },
  },
];
