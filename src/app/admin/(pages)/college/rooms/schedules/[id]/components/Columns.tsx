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
      return (
        <div key={cell.id} className=' uppercase'>
          {row.index + 1}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => (row.blockTypeId ? row.blockTypeId.section : 'block'),
    id: 'block type',
    header: 'Block Type',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.blockTypeId && user.blockTypeId.section ? user.blockTypeId.section : <div className='text-red'>Not Assign</div>}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.courseId.courseCode,
    id: 'course code',
    header: 'Course Code',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.courseId?.courseCode && user.courseId.courseCode ? user.courseId.courseCode : <div className='text-red'>Not Assign</div>}
        </div>
      );
    },
  },
  {
    accessorKey: 'Fullname',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Instructor
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' capitalize'>
          {user.profileId.firstname ?? ''}
          {user.profileId.middlename ?? ''} {user.profileId.lastname ?? ''} {user.profileId.extensionName ? user.profileId.extensionName + '.' : ''}
        </div>
      );
    },
    accessorFn: (row) => {
      const { lastname, firstname, middlename, extensionName } = row.profileId;
      return `${firstname ?? ''} ${middlename ?? ''} ${lastname ?? ''} ${extensionName ?? ''}`.trim();
    },
    filterFn: (row, columnId, filterValue) => {
      const user = row.original;
      const fullName = `${row.original.profileId.firstname ?? ''} ${row.original.profileId.middlename ?? ''} ${row.original.profileId.lastname ?? ''} ${row.original.profileId.extensionName ?? ''}`.toLowerCase().trim();
      return fullName.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorFn: (row) => row.subjectId.subjectCode,
    id: 'subject code',
    header: 'Subject Code',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.subjectId.subjectCode}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.subjectId.name,
    id: 'Descriptive Title',
    header: 'Descriptive Title',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.subjectId.name}
        </div>
      );
    },
  },

  {
    accessorFn: (row) => row.days,
    id: 'days',
    header: 'Days',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user.days.join(', ')}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.startTime,
    id: 'start time',
    header: 'Start Time',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user.startTime}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.endTime,
    id: 'end time',
    header: 'End Time',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user.endTime}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.roomId.roomName,
    id: 'room',
    header: 'Room',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user.roomId.roomName}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.subjectId.lec,
    id: 'lec',
    header: 'Lec',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user.subjectId.lec}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.subjectId.lab,
    id: 'lab',
    header: 'Lab',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user.subjectId.lab}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.subjectId.unit,
    id: 'unit',
    header: 'Unit',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user.subjectId.unit}
        </div>
      );
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
