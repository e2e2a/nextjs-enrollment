'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ActionsCell from './ActionsCell';
import { ISchoolYear } from '@/types';

export const columns: ColumnDef<ISchoolYear>[] = [
  {
    accessorKey: 'schoolYear',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          FullName
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.schoolYear}
        </div>
      );
    },
    accessorFn: (row) => {
      const { schoolYear } = row;
      return `${schoolYear}`;
    },
    filterFn: (row, columnId, filterValue) => {
      const schoolYear = `${row.original.schoolYear}`.toLowerCase();
      return schoolYear.includes(filterValue.toLowerCase());
    },
  },

  {
    accessorFn: (row) => row.isEnable, // Use accessorFn for nested fields
    id: 'isEnabled',
    header: 'isEnabled',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.isEnable ? <span className='text-green-500 text-sm'>True</span> : <span className='text-red text-sm'>False</span>}
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
