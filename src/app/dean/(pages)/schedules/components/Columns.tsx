'use client';
import { ColumnDef } from '@tanstack/react-table';
import ActionsCell from './ActionsCell';

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
    accessorFn: (row) => row.courseId.courseCode,
    id: 'course code',
    header: 'Course Code',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.courseId?.courseCode ? user.courseId?.courseCode : <span className="text-red uppercase text-xs">not assigned</span> }
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.blockTypeId?.section,
    id: 'block type',
    header: 'Block Type',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
           {user?.blockTypeId?.section ? <span className="text-xs">{user?.blockTypeId?.section}</span> : <span className="text-xs text-red">N/A</span> }
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.blockTypeId?.year,
    id: 'year',
    header: 'Year',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.blockTypeId?.year ? user?.blockTypeId?.year : <span className="text-xs text-red">N/A</span> }
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.blockTypeId?.semester,
    id: 'semester',
    header: 'Semester',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.blockTypeId?.semester ? user?.blockTypeId?.semester : <span className="text-xs text-red">N/A</span> }
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.subjectId?.subjectCode,
    id: 'subject code',
    header: 'Subject Code',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.subjectId?.subjectCode}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.subjectId?.name,
    id: 'Descriptive Title',
    header: 'Descriptive Title',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.subjectId?.name}
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
        <div key={cell.id} className=' uppercase'>
          {user.subjectId.lec}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.subjectId?.lab,
    id: 'lab',
    header: 'Lab',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.subjectId?.lab}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.subjectId?.unit,
    id: 'unit',
    header: 'Unit',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.subjectId?.unit}
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
          {user?.days.join(', ')}
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
          {user?.startTime}
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
          {user?.endTime}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.roomId.roomName,
    id: 'room name',
    header: 'Room Name',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.roomId?.roomName}
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
