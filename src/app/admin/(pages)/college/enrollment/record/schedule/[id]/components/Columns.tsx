'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ActionsCell from './ActionsCell';

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Student Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' capitalize'>
          {user.student.firstname ?? ''} {user.student.middlename ?? ''} {user.student.lastname ?? ''} {user.student.extensionName ?? ''}
        </div>
      );
    },
    accessorFn: (row) => {
      const { lastname, firstname, middlename, extensionName } = row.student;
      return `${firstname ?? ''} ${middlename ?? ''} ${lastname ?? ''} ${extensionName ?? ''}`.trim();
    },
    filterFn: (row, columnId, filterValue) => {
      const fullName = `${row.original.student.firstname ?? ''} ${row.original.student.middlename ?? ''} ${row.original.student.lastname} ${row.original.student.extensionName ?? ''}`.toLowerCase().trim();
      return fullName.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorFn: (row) => row.student.sex,
    id: 'gender',
    header: 'Gender',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.student.sex}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.grade,
    id: 'grade',
    header: 'Grade',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase font-bold'>
          {user.grade}
        </div>
      );
    },
  },
];
