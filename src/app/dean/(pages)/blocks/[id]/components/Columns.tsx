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
    accessorFn: (row) => row.teacherScheduleId?.subjectId?.subjectCode,
    id: 'subjectCode',
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
        <div key={cell.id} className=''>
          {user?.teacherScheduleId?.subjectId?.name}
        </div>
      );
    },
    accessorFn: (row) => `${row.teacherScheduleId?.subjectId?.name}`,
    filterFn: (row, columnId, filterValue) => {
      const user = row.original;
      const descriptiveTitle = `${user.teacherScheduleId?.subjectId?.name}`.toLowerCase();
      return descriptiveTitle.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId?.subjectId?.preReq,
    id: 'pre req.',
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
        <div key={cell.id} className=' uppercase'>
          {user?.teacherScheduleId?.subjectId?.lab}
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
          {user.teacherScheduleId.endTime}
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
      const user = row.original;

      const formatName = (person: any) => {
        return `${person?.lastname ? person?.lastname + ',' : ''} ${person?.firstname ?? ''} ${person?.middlename ?? ''}${person?.extensionName ? ', ' + person?.extensionName + '.' : ''}`
          .replace(/\s+,/g, ',')
          .replace(/,(\S)/g, ', $1')
          .replace(/\s+/g, ' ')
          .trim();
      };

      const instructorName = user?.teacherScheduleId?.profileId ? formatName(user?.teacherScheduleId?.profileId) : '';
      const deanName = user?.teacherScheduleId?.deanId ? formatName(user?.teacherScheduleId?.deanId) : '';

      return (
        <div key={cell.id} className='capitalize'>
          {user.teacherScheduleId?.deanId && <span>{deanName}</span>}
          {user.teacherScheduleId?.profileId && <span>{instructorName}</span>}
        </div>
      );
    },

    accessorFn: (row) => {
      const formatName = (person: any) => {
        return `${person?.lastname ? person?.lastname + ',' : ''} ${person?.firstname ?? ''} ${person?.middlename ?? ''}${person?.extensionName ? ', ' + person?.extensionName + '.' : ''}`
          .replace(/\s+,/g, ',')
          .replace(/,(\S)/g, ', $1')
          .replace(/\s+/g, ' ')
          .trim();
      };

      const instructorName = row.teacherScheduleId?.profileId ? formatName(row.teacherScheduleId.profileId) : '';
      const deanName = row.teacherScheduleId?.deanId ? formatName(row.teacherScheduleId.deanId) : '';

      return `${instructorName} ${deanName}`.trim();
    },

    filterFn: (row, columnId, filterValue) => {
      const user = row.original.teacherScheduleId;

      const formatNameForSearch = (person: any) => {
        return `${person?.lastname ? person?.lastname + ',' : ''} ${person?.firstname ?? ''} ${person?.middlename ?? ''}${person?.extensionName ? ', ' + person?.extensionName + '.' : ''}`
          .replace(/\s+,/g, ',')
          .replace(/,(\S)/g, ', $1')
          .replace(/\s+/g, ' ')
          .toLowerCase()
          .trim();
      };

      const instructorName = user.profileId ? formatNameForSearch(user.profileId) : '';
      const deanName = user.deanId ? formatNameForSearch(user.deanId) : '';

      return instructorName.includes(filterValue.toLowerCase()) || deanName.includes(filterValue.toLowerCase());
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
