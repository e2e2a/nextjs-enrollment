'use client';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown, ChevronsUpDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ActionsCell from './ActionsCell';
import { IStudentCurriculum } from '@/types';

export const columns: ColumnDef<IStudentCurriculum>[] = [
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
      return <div key={cell.id}>{user.studentId.lastname && user.studentId.firstname ? user.studentId.lastname + ',' + ' ' + user.studentId.firstname + ' ' + user.studentId.middlename : 'Unknown'}</div>;
    },
    accessorFn: (row) => `${row.studentId.lastname}, ${row.studentId.firstname} ${row.studentId.middlename}`,
    filterFn: (row, columnId, filterValue) => {
      const user = row.original;
      const fullName = `${row.original.studentId.lastname}, ${row.original.studentId.firstname} ${row.original.studentId.middlename}`.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    },
  },
  // {
  //   accessorFn: (row) => row.sex,
  //   id: 'sex',
  //   header: 'Sex',
  //   cell: ({ cell, row }) => {
  //     const user = row.original;
  //     return (
  //       <div key={cell.id} className=' uppercase'>
  //         {user.sex}
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: 'Course Name',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Course Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' capitalize'>
          {user.courseId.name}
        </div>
      );
    },
    accessorFn: (row) => {
      const { name } = row.courseId;
      return `${name}`;
    },
    filterFn: (row, columnId, filterValue) => {
      const name = `${row.original.courseId.name}`.toLowerCase();
      return name.includes(filterValue.toLowerCase());
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
    accessorKey: 'updatedAt',
    header: 'UpdatedAt',
    cell: ({ row }) => {
      const date = new Date(row.getValue('updatedAt'));
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
