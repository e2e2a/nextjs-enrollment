'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ActionsCell from './ActionsCell';

export const columns: ColumnDef<any>[] = [
  {
    accessorFn: (row) => row?.courseId?.name,
    id: 'Deparment',
    header: 'Deparment',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.courseId?.name ?? 'N/A'}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.subjectCode,
    accessorKey: 'Subject Code',
    header: 'Subject Code',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='flex justify-center items-center'>
          {user?.subjectCode}
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Descriptive Title
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.name}
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
    accessorFn: (row) => row?.preReq,
    id: 'pre req.',
    header: 'Pre Req.',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.preReq ?? ''}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.lec,
    id: 'lec',
    header: 'Lec',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.lec}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.lec,
    id: 'lab',
    header: 'Lab',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.lab}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.lec,
    id: 'unit',
    header: 'Unit/s',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.unit}
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
  // {
  //   id: 'actions',
  //   header: 'Actions',
  //   cell: ({ row }) => {
  //     const user = row.original;

  //     return <ActionsCell user={user} />;
  //   },
  // },
];
