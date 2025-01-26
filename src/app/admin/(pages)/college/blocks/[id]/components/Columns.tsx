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
    accessorFn: (row) => row.teacherScheduleId.subjectId.subjectCode,
    id: 'code',
    header: 'Subject Code',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.teacherScheduleId?.subjectId.subjectCode}
        </div>
      );
    },
  },
  {
    accessorKey: 'Descriptive Title',
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
        <div key={cell.id} className='capitalize'>
          {user?.teacherScheduleId?.subjectId.name}
        </div>
      );
    },
    accessorFn: (row) => `${row.teacherScheduleId.subjectId.name}`,
    filterFn: (row, columnId, filterValue) => {
      const user = row.original;
      const descriptiveTitle = `${user.teacherScheduleId.subjectId.name}`.toLowerCase();
      return descriptiveTitle.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId.subjectId.preReq,
    id: 'pre req.',
    header: 'Pre Req.',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.teacherScheduleId?.subjectId.preReq}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId.subjectId.lec,
    id: 'lec',
    header: 'Lec',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.teacherScheduleId?.subjectId.lec}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId.subjectId.lab,
    id: 'lab',
    header: 'Lab',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.teacherScheduleId?.subjectId.lab}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId.subjectId.unit,
    id: 'unit',
    header: 'Unit',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.teacherScheduleId?.subjectId.unit}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId.days,
    id: 'days',
    header: 'Days',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user.teacherScheduleId.days.join(', ')}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId.startTime,
    id: 'start time',
    header: 'Start Time',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user.teacherScheduleId.startTime}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId.endTime,
    id: 'end time',
    header: 'End Time',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user.teacherScheduleId.endTime}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId.roomId.roomName,
    id: 'room name',
    header: 'Room Name',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user.teacherScheduleId.roomId.roomName}
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
      const user = row.original.teacherScheduleId;
      return (
        <div key={cell.id} className='capitalize'>
          {user.deanId && (
            <span>
              {user?.deanId?.firstname ?? ''} {user?.deanId?.middlename ?? ''} {user?.deanId?.lastname ?? ''} {user?.deanId?.extensionName ? user.deanId?.extensionName + '.' : ''}
            </span>
          )}
          {user.profileId && (
            <span>
              {user?.profileId?.firstname ?? ''} {user?.profileId?.middlename ?? ''} {user?.profileId?.lastname ?? ''} {user?.profileId?.extensionName ? user.profileId?.extensionName + '.' : ''}
            </span>
          )}
        </div>
      );
    },
    accessorFn: (row) =>
      `
    ${row.teacherScheduleId?.profileId && `${row.teacherScheduleId?.profileId?.firstname} ${row.teacherScheduleId?.profileId?.middlename ?? ''} ${row.teacherScheduleId?.profileId?.lastname} ${row.teacherScheduleId?.profileId?.extensionName ?? ''}`}
    ${row.teacherScheduleId?.deanId && `${row.teacherScheduleId?.deanId?.firstname} ${row.teacherScheduleId?.deanId?.middlename ?? ''} ${row.teacherScheduleId?.deanId?.lastname} ${row.teacherScheduleId?.deanId?.extensionName ?? ''}`}
    `.trim(),
    filterFn: (row, columnId, filterValue) => {
      const user = row.original;
      const fullName = `${user.teacherScheduleId?.profileId?.firstname ?? ''} ${user.teacherScheduleId?.profileId?.middlename ?? ''} ${user.teacherScheduleId?.profileId?.lastname ?? ''} ${user.teacherScheduleId?.profileId?.extensionName ?? ''}`
        .toLowerCase()
        .trim();
      const deanName = `${user.teacherScheduleId?.deanId?.firstname ?? ''} ${user.teacherScheduleId?.deanId?.middlename ?? ''} ${user.teacherScheduleId?.deanId?.lastname ?? ''} ${user.teacherScheduleId?.deanId?.extensionName ?? ''}`.toLowerCase().trim();
      return fullName.includes(filterValue.toLowerCase()) || deanName.includes(filterValue.toLowerCase());
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
