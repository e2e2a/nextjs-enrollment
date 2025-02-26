'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

export const columns: ColumnDef<any>[] = [
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
      const user = row.original?.profileId;

      const formattedName = `${user?.lastname ? user?.lastname + ',' : ''} ${user?.firstname ?? ''} ${user?.middlename ?? ''}${user?.extensionName ? ', ' + user?.extensionName + '.' : ''}`
        .replace(/\s+,/g, ',') // Remove space before commas
        .replace(/(\S),/g, '$1,') // Ensure proper comma placement
        .replace(/,(\S)/g, ', $1') // Add space after commas
        .trim();

      return (
        <div key={cell.id} className='capitalize'>
          {formattedName}
        </div>
      );
    },

    accessorFn: (row) => {
      const user = row.profileId;
      return `${user?.lastname ? user?.lastname + ',' : ''} ${user?.firstname ?? ''} ${user?.middlename ?? ''}${user?.extensionName ? ', ' + user?.extensionName + '.' : ''}`.replace(/\s+,/g, ',').replace(/(\S),/g, '$1,').replace(/,(\S)/g, ', $1').trim();
    },

    filterFn: (row, columnId, filterValue) => {
      const user = row.original?.profileId;

      const fullName = `${user?.lastname ? user?.lastname + ',' : ''} ${user?.firstname ?? ''} ${user?.middlename ?? ''}${user?.extensionName ? ', ' + user?.extensionName + '.' : ''}`
        .replace(/\s+,/g, ',')
        .replace(/(\S),/g, '$1,')
        .replace(/,(\S)/g, ', $1')
        .trim()
        .toLowerCase();

      return fullName.includes(filterValue.toLowerCase());
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
    accessorFn: (row) => row.thirdGrade,
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
