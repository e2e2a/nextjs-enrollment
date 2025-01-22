'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ActionsCell from './ActionsCell';

export const columns: ColumnDef<any>[] = [
  {
    accessorFn: (row) => row.orderID,
    id: 'orderID',
    header: 'Order #',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.orderID}
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
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
        <div key={cell.id} className=' capitalize'>
          {user.studentId.firstname ?? ''} {user.studentId.middlename ?? ''} {user.studentId.lastname ?? ''}
        </div>
      );
    },
    accessorFn: (row) => {
      const { name } = row;
      return `${name}`;
    },
    filterFn: (row, columnId, filterValue) => {
      const stud = row.original.studentId;
      const fullName = `${stud.firstname ?? ''} ${stud.middlename ?? ''} ${stud.lastname ?? ''}`.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorFn: (row) => row.captureTime,
    header: 'Billing Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('Billing Date'));
      const formatted = date.toLocaleDateString();

      return <div className='font-medium'>{formatted}</div>;
    },
  },
  {
    accessorFn: (row) => row.type, // Use accessorFn for nested fields
    id: 'type',
    header: 'Type',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase font-semibold'>
          {user.type === 'DownPayment' && 'Down Payment'}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.amount.value, // Use accessorFn for nested fields
    id: 'Amount',
    header: 'Amount',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.amount.value && `₱${Number(user.amount.value).toFixed(2)}`}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.schoolYear, // Use accessorFn for nested fields
    id: 'school year',
    header: 'School Year',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase font-semibold'>
          {user.schoolYear ?? ''}
        </div>
      );
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
