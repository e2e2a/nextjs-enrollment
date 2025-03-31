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
          Instructor
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ cell, row }) => {
      const user = row.original;
      const dean = user?.deanId;
      const instructor = user?.profileId;

      const formattedDeanName = dean
        ? `${dean?.lastname ? dean?.lastname + ',' : ''} ${dean?.firstname ?? ''} ${dean?.middlename ?? ''}${dean?.extensionName ? ', ' + dean?.extensionName + '.' : ''}`.replace(/\s+,/g, ',').replace(/(\S),/g, '$1,').replace(/,(\S)/g, ', $1').trim()
        : '';

      const formattedInstructorName = instructor
        ? `${instructor?.lastname ? instructor?.lastname + ',' : ''} ${instructor?.firstname ?? ''} ${instructor?.middlename ?? ''}${instructor?.extensionName ? ', ' + instructor?.extensionName + '.' : ''}`
            .replace(/\s+,/g, ',')
            .replace(/(\S),/g, '$1,')
            .replace(/,(\S)/g, ', $1')
            .trim()
        : '';

      return (
        <div key={cell.id} className='capitalize'>
          {formattedDeanName && <span>{formattedDeanName}</span>}
          {formattedDeanName && formattedInstructorName && <br />}
          {formattedInstructorName && <span>{formattedInstructorName}</span>}
        </div>
      );
    },

    accessorFn: (row) => {
      const user = row.teacherScheduleId;
      const instructor = user?.profileId;
      const dean = user?.deanId;

      const formattedInstructorName = instructor
        ? `${instructor?.lastname ? instructor?.lastname + ',' : ''} ${instructor?.firstname ?? ''} ${instructor?.middlename ?? ''}${instructor?.extensionName ? ', ' + instructor?.extensionName + '.' : ''}`
            .replace(/\s+,/g, ',')
            .replace(/,(\S)/g, ', $1')
            .replace(/\s+/g, ' ')
            .toLowerCase()
            .trim()
        : '';

      const formattedDeanName = dean
        ? `${dean?.lastname ? dean?.lastname + ',' : ''} ${dean?.firstname ?? ''} ${dean?.middlename ?? ''}${dean?.extensionName ? ', ' + dean?.extensionName + '.' : ''}`.replace(/\s+,/g, ',').replace(/,(\S)/g, ', $1').replace(/\s+/g, ' ').toLowerCase().trim()
        : '';

      return `${formattedInstructorName} ${formattedDeanName}`.trim();
    },

    filterFn: (row, columnId, filterValue) => {
      const user = row.original;
      const instructor = user?.profileId;
      const dean = user?.deanId;

      const formattedInstructorName = instructor
        ? `${instructor?.lastname ? instructor?.lastname + ',' : ''} ${instructor?.firstname ?? ''} ${instructor?.middlename ?? ''}${instructor?.extensionName ? ', ' + instructor?.extensionName + '.' : ''}`
            .replace(/\s+,/g, ',')
            .replace(/,(\S)/g, ', $1')
            .replace(/\s+/g, ' ')
            .toLowerCase()
            .trim()
        : '';

      const formattedDeanName = dean
        ? `${dean?.lastname ? dean?.lastname + ',' : ''} ${dean?.firstname ?? ''} ${dean?.middlename ?? ''}${dean?.extensionName ? ', ' + dean?.extensionName + '.' : ''}`.replace(/\s+,/g, ',').replace(/,(\S)/g, ', $1').replace(/\s+/g, ' ').toLowerCase().trim()
        : '';

      return formattedInstructorName.includes(filterValue.toLowerCase()) || formattedDeanName.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorFn: (row) => row.courseId?.courseCode,
    id: 'course code',
    header: 'Course Code',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.courseId?.courseCode ? user?.courseId?.courseCode : <span className='text-red uppercase text-xs'>not assigned</span>}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.blockTypeId?.section,
    id: 'section',
    header: 'Section',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.blockTypeId?.section ? user?.blockTypeId?.section : <span className='text-red uppercase text-xs'>not assigned</span>}
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
        <div key={cell.id} className='uppercase'>
          {user?.blockTypeId?.year ? user?.blockTypeId?.year : <span className='text-red uppercase text-xs'>not assigned</span>}
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
        <div key={cell.id} className='uppercase'>
          {user?.blockTypeId?.semester ? user?.blockTypeId?.semester : <span className='text-red uppercase text-xs'>not assigned</span>}
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
          {user?.subjectId?.name}
        </div>
      );
    },
    accessorFn: (row) => `${row.subjectId?.name}`,
    filterFn: (row, columnId, filterValue) => {
      const user = row.original;
      const descriptiveTitle = `${user?.subjectId?.name}`.toLowerCase();
      return descriptiveTitle.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorFn: (row) => row?.days,
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
    accessorFn: (row) => row?.startTime,
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
    accessorFn: (row) => row?.endTime,
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
    accessorFn: (row) => row.roomId?.roomName,
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
