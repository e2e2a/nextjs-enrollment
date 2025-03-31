'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ActionsCell from './ActionsCell';
import { IBlockType } from '@/types';

export const columns: ColumnDef<IBlockType>[] = [
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
    accessorKey: 'Block Type',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Block Type
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          block {user?.section}
        </div>
      );
    },
    accessorFn: (row) => `${row.section}`,
    filterFn: (row, columnId, filterValue) => {
      const user = row.original;
      const fullName = `block ${user?.section}`.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorFn: (row) => row.courseId?.courseCode,
    id: 'Course Code',
    header: 'Course Code',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.courseId?.courseCode}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.courseId?.name,
    id: 'course title',
    header: 'Course Title',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {/* {Array.isArray(user?.schedule) ? user?.schedule.length : 0} */}
          {user?.courseId?.name}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.year,
    id: 'year',
    header: 'Year',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' capitalize'>
          {user?.year}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.semester,
    id: 'semester',
    header: 'Semester',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' capitalize'>
          {user?.semester}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.blockSubjects.length,
    id: 'schedules count',
    header: 'Schedules Count',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' '>
          {user?.blockSubjects.length === 0 ? <span className='text-red'>{user?.blockSubjects.length}</span> : <span className='text-green-500'>{user?.blockSubjects.length}</span>}
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
