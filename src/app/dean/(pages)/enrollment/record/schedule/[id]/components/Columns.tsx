'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      const user = row.original.student;
      if (!user) return <div key={cell.id}>Unknown</div>;

      const name = `${user.lastname ? user.lastname + ',' : ''} ${user.firstname ?? ''} ${user.middlename ?? ''}${user.extensionName ? ', ' + user.extensionName + '.' : ''}`
        .replace(/\s+,/g, ',') // Fix spaces before commas
        .replace(/,(\S)/g, ', $1') // Ensure proper comma spacing
        .replace(/\s+/g, ' ') // Remove extra spaces
        .trim();

      return (
        <div key={cell.id} className='capitalize'>
          {name}
        </div>
      );
    },

    accessorFn: (row) => {
      const user = row.student;
      if (!user) return '';

      return `${user.lastname ? user.lastname + ',' : ''} ${user.firstname ?? ''} ${user.middlename ?? ''}${user.extensionName ? ', ' + user.extensionName + '.' : ''}`.replace(/\s+,/g, ',').replace(/,(\S)/g, ', $1').replace(/\s+/g, ' ').trim();
    },

    filterFn: (row, columnId, filterValue) => {
      const user = row.original.student;
      if (!user) return false;

      const fullName = `${user.lastname ? user.lastname + ',' : ''} ${user.firstname ?? ''} ${user.middlename ?? ''}${user.extensionName ? ', ' + user.extensionName + '.' : ''}`
        .replace(/\s+,/g, ',')
        .replace(/,(\S)/g, ', $1')
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .trim();

      return fullName.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorFn: (row) => row.student?.sex,
    id: 'gender',
    header: 'Gender',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.student?.sex}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.firstGrade,
    id: 'prelim',
    header: 'Prelim',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user?.firstGrade}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.secondGrade,
    id: 'midterm',
    header: 'Midterm',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user?.secondGrade}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.thirdGrade,
    id: 'semi-final',
    header: 'Semi-final',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user?.thirdGrade}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.fourthGrade,
    id: 'final',
    header: 'Final',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user?.fourthGrade}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.averageTotal,
    id: 'averageTotal',
    header: 'Average Total',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user?.averageTotal}
        </div>
      );
    },
  },
];
