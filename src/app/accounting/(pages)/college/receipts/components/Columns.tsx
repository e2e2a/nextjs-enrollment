'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ActionsCell from './ActionsCell';

export const columns: ColumnDef<any>[] = [
  {
    accessorFn: (row) => row?.orderID,
    id: 'orderID',
    header: 'Order #',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.orderID ? user?.orderID : <span className='text-red font-semibold'>N/A</span>}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.paymentMethod,
    id: 'Payment Method',
    header: 'Payment Method',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.paymentMethod}
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
      const user = row.original.studentId;
      const name = `${user?.lastname ? user?.lastname + ',' : ''} ${user?.firstname ?? ''} ${user?.middlename ?? ''}${user?.extensionName ? ', ' + user?.extensionName : ''}`.replace(/\s+,/g, ',').replace(/(\S),/g, '$1,').replace(/,(\S)/g, ', $1').trim();
      return (
        <div key={cell.id} className=' capitalize'>
          {name}
        </div>
      );
    },
    accessorFn: (row) => {
      const user = row.studentId;
      return `${user?.lastname ? user?.lastname + ',' : ''} ${user?.firstname ?? ''} ${user?.middlename ?? ''}${user?.extensionName ? ', ' + user?.extensionName : ''}`.replace(/\s+,/g, ',').replace(/,(\S)/g, ', $1').replace(/\s+/g, ' ').toLowerCase().trim();
    },

    filterFn: (row, columnId, filterValue) => {
      const user = row.original.studentId;
      const fullName = `${user?.lastname ? user?.lastname + ',' : ''} ${user?.firstname ?? ''} ${user?.middlename ?? ''}${user?.extensionName ? ', ' + user?.extensionName : ''}`
        .replace(/\s+,/g, ',')
        .replace(/,(\S)/g, ', $1')
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .trim();

      return fullName.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorFn: (row) => row.captureTime,
    header: 'Billing Date',
    cell: ({ row }) => {
      let date;
      date = new Date(row.getValue('Billing Date'));
      let formatted;
      formatted = date.toLocaleDateString();
      if (formatted.toLowerCase() === 'invalid date') formatted = new Date(row.original?.createdAt).toLocaleDateString();

      return <div className='font-medium'>{formatted}</div>;
    },
  },
  {
    accessorFn: (row) => row?.type,
    id: 'type',
    header: 'Type',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase font-semibold'>
          {user?.type.toLowerCase() === 'downpayment' && 'Down Payment'}
          {user?.type.toLowerCase() === 'prelim' && 'Prelim Payment'}
          {user?.type.toLowerCase() === 'midterm' && 'Midterm Payment'}
          {user?.type.toLowerCase() === 'semi-final' && 'Semi-final Payment'}
          {user?.type.toLowerCase() === 'final' && 'Final Payment'}
          {user?.type.toLowerCase() === 'fullpayment' && 'Full Payment'}
          {user?.type.toLowerCase() === 'departmental' && 'Departmental Payment'}
          {user?.type.toLowerCase() === 'ssg' && 'SSG Payment'}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.amount?.value,
    id: 'Amount',
    header: 'Amount',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.amount?.value && `₱${Number(user?.amount?.value).toFixed(2)}`}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.year,
    id: 'year',
    header: 'Year',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase font-semibold'>
          {user?.year ?? ''}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.semester,
    id: 'semester',
    header: 'Semester',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase font-semibold'>
          {user?.semester ?? ''}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.schoolYear,
    id: 'school year',
    header: 'School Year',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase font-semibold'>
          {user?.schoolYear ?? ''}
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
