'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ActionsCell from './ActionsCell';
import Image from 'next/image';

export const columns: ColumnDef<any>[] = [
  {
    accessorFn: (row) => row.imageUrl,
    accessorKey: 'course image',
    header: 'Course Image',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='flex justify-center items-center'>
          {user.imageUrl ? <Image className='w-20 h-12 border rounded-md shadow-sm drop-shadow-sm' src={`${user.imageUrl}`} alt={`${user.courseCode}`} width={100} priority height={100} /> : <div className='flex justify-center items-center'>No Photo</div>}
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Course Title
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' capitalize'>
          {user.name}
        </div>
      );
    },
    accessorFn: (row) => {
      const { name } = row;
      return `${name}`;
    },
    filterFn: (row, columnId, filterValue) => {
      const fullName = `${row.original.name}`.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    },
  },

  {
    accessorFn: (row) => row.courseCode, // Use accessorFn for nested fields
    id: 'course Code',
    header: 'Course',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.courseCode}
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
