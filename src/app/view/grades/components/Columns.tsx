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
      return (
        <div key={cell.id} className=' uppercase'>
          {row.index + 1}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId?.blockTypeId?.section,
    id: 'block type',
    header: 'Block Type',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.teacherScheduleId?.blockTypeId?.section}
        </div>
      );
    },
  },

  {
    accessorFn: (row) => row.teacherScheduleId?.subjectId?.subjectCode,
    id: 'subject code',
    header: 'Subject Code',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.teacherScheduleId?.subjectId?.subjectCode}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId?.subjectId?.name,
    id: 'Descriptive Title',
    header: 'Descriptive Title',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.teacherScheduleId?.subjectId?.name}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId?.subjectId?.preReq,
    id: 'Pre Req.',
    header: 'Pre Req.',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.teacherScheduleId?.subjectId?.preReq ?? ''}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId?.subjectId?.lec,
    id: 'lec',
    header: 'Lec',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.teacherScheduleId?.subjectId?.lec}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId?.subjectId?.lab,
    id: 'lab',
    header: 'Lab',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.teacherScheduleId?.subjectId?.lab}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId?.subjectId?.unit,
    id: 'unit',
    header: 'Unit',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.teacherScheduleId?.subjectId?.unit}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId?.days,
    id: 'days',
    header: 'Days',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user?.teacherScheduleId?.days.join(', ')}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId?.startTime,
    id: 'start time',
    header: 'Start Time',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user?.teacherScheduleId?.startTime}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId?.endTime,
    id: 'end time',
    header: 'End Time',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user?.teacherScheduleId?.endTime}
        </div>
      );
    },
  },

  {
    accessorFn: (row) => row.teacherScheduleId?.roomId?.roomName,
    id: 'room name',
    header: 'Room Name',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.teacherScheduleId?.roomId?.roomName}
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
      const user = row.original?.teacherScheduleId?.profileId;

      const formattedName = `${user?.lastname ? user?.lastname + ',' : ''} ${user?.firstname ?? ''} ${user?.middlename ?? ''}${user?.extensionName ? ', ' + user?.extensionName + '.' : ''}`
        .replace(/\s+,/g, ',')
        .replace(/(\S),/g, '$1,')
        .replace(/,(\S)/g, ', $1')
        .trim();

      return (
        <div key={cell.id} className='capitalize'>
          {formattedName}
        </div>
      );
    },

    accessorFn: (row) => {
      const user = row.teacherScheduleId?.profileId;
      return `${user?.lastname ? user?.lastname + ',' : ''} ${user?.firstname ?? ''} ${user?.middlename ?? ''}${user?.extensionName ? ', ' + user?.extensionName + '.' : ''}`
        .replace(/\s+,/g, ',')
        .replace(/,(\S)/g, ', $1')
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .trim();
    },

    filterFn: (row, columnId, filterValue) => {
      const user = row.original?.teacherScheduleId?.profileId;

      const fullName = `${user?.lastname ? user?.lastname + ',' : ''} ${user?.firstname ?? ''} ${user?.middlename ?? ''}${user?.extensionName ? ', ' + user?.extensionName + '.' : ''}`
        .replace(/\s+,/g, ',')
        .replace(/,(\S)/g, ', $1')
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .trim();

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
