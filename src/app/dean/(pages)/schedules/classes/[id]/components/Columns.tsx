'use client';
import { ColumnDef } from '@tanstack/react-table';
import ActionsCell from './ActionsCell';
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
      const user = row.original;
      return <div key={cell.id}>{user.profileId.lastname && user.profileId.firstname ? user.profileId.lastname + ',' + ' ' + user.profileId.firstname + ' ' + user.profileId.middlename : 'Unknown'}</div>;
    },
    accessorFn: (row) => `${row.profileId.lastname}, ${row.profileId.firstname} ${row.profileId.middlename}`,
    filterFn: (row, columnId, filterValue) => {
      const user = row.original;
      const fullName = `${row.original.profileId.lastname}, ${row.original.profileId.firstname} ${row.original.profileId.middlename}`.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    },
  },
  // {
  //   accessorFn: (row) => row.courseId.courseCode,
  //   id: 'course code',
  //   header: 'Course Code',
  //   cell: ({ cell, row }) => {
  //     const user = row.original;
  //     return (
  //       <div key={cell.id} className=' uppercase'>
  //         {user.courseId.courseCode}
  //       </div>
  //     );
  //   },
  // },
  {
    accessorFn: (row) => row.profileId.sex,
    id: 'Gender',
    header: 'Gender',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.profileId.sex}
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
        <div key={cell.id} className=' uppercase'>
          {user.grade}
        </div>
      );
    },
  },
  // {
  //   accessorFn: (row) => row.endTime,
  //   id: 'end time',
  //   header: 'End Time',
  //   cell: ({ cell, row }) => {
  //     const user = row.original;
  //     return (
  //       <div key={cell.id} className='uppercase'>
  //         {user.endTime}
  //       </div>
  //     );
  //   },
  // },
  // {
  //   id: 'actions',
  //   header: 'Actions',
  //   cell: ({ row }) => {
  //     const user = row.original;

  //     return <ActionsCell user={user} />;
  //   },
  // },
];
