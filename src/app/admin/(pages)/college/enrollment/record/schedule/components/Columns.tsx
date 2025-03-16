'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ActionsCell from './ActionsCell';

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Instructor Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ cell, row }) => {
      const user = row.original;

      const formatName = (person: any) => {
        if (!person) return '';
        return `${person?.lastname ? person?.lastname + ',' : ''} ${person?.firstname ?? ''} ${person?.middlename ?? ''}${person?.extensionName ? ', ' + person?.extensionName + '.' : ''}`
          .replace(/\s+,/g, ',') // Fixes spaces before commas
          .replace(/,(\S)/g, ', $1') // Ensures proper comma spacing
          .replace(/\s+/g, ' ') // Replaces multiple spaces with a single space
          .trim();
      };

      const instructorName = user.profileId ? formatName(user.profileId) : '';
      const deanName = user.deanId ? formatName(user.deanId) : '';

      return (
        <div key={cell.id} className='capitalize'>
          {instructorName && <span>{instructorName}</span>}
          {deanName && <span>{deanName}</span>}
        </div>
      );
    },

    accessorFn: (row) => {
      const formatName = (person: any) => {
        if (!person) return '';
        return `${person?.lastname ? person?.lastname + ',' : ''} ${person?.firstname ?? ''} ${person?.middlename ?? ''}${person?.extensionName ? ', ' + person?.extensionName + '.' : ''}`
          .replace(/\s+,/g, ',')
          .replace(/,(\S)/g, ', $1')
          .replace(/\s+/g, ' ')
          .trim();
      };

      const instructorName = row.profileId ? formatName(row.profileId) : '';
      const deanName = row.deanId ? formatName(row.deanId) : '';

      return `${instructorName} ${deanName}`.trim();
    },

    filterFn: (row, columnId, filterValue) => {
      const user = row.original;

      const formatNameForSearch = (person: any) => {
        if (!person) return '';
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
    accessorFn: (row) => row.category,
    id: 'category',
    header: 'Category',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.category}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.course?.courseCode,
    id: 'course code',
    header: 'Course Code',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.course?.courseCode}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.blockType,
    id: 'block',
    header: 'Block',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.blockType?.section ?? 'N/A'}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.subject?.subjectCode,
    id: 'subject code',
    header: 'Subject Code',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.subject?.subjectCode}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.subject?.name,
    id: 'descriptive title',
    header: 'Descriptive Title',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.subject?.name}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.subject?.preReq,
    id: 'Pre Req.',
    header: 'Pre Req.',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.subject?.preReq ?? ''}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.blockType?.year,
    id: 'year',
    header: 'Year',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.blockType?.year}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.blockType?.semester,
    id: 'semester',
    header: 'Semester',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.blockType?.semester}
        </div>
      );
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
    accessorFn: (row) => row.room?.roomName,
    id: 'room name',
    header: 'Room Name',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.room?.roomName}
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
        <div key={cell.id} className=' uppercase'>
          {user?.schoolYear}
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'CreatedAt',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      const formatted = date.toLocaleDateString();

      return <div className='font-medium'>{formatted}</div>;
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
