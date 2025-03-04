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
      if (!user) return <div key={cell.id}>Unknown</div>;

      const deanName = `${user.deanId?.lastname ? user.deanId?.lastname + ',' : ''} ${user.deanId?.firstname ?? ''} ${user.deanId?.middlename ?? ''}${user.deanId?.extensionName ? ', ' + user.deanId?.extensionName + '.' : ''}`
        .replace(/\s+,/g, ',')
        .replace(/(\S),/g, '$1,')
        .replace(/,(\S)/g, ', $1')
        .trim();

      const teacherName = `${user.profileId?.lastname ? user.profileId?.lastname + ',' : ''}${user.profileId?.firstname ?? ''} ${user.profileId?.middlename ?? ''}${user.profileId?.extensionName ? ', ' + user.profileId?.extensionName + '.' : ''}`
        .replace(/\s+,/g, ',')
        .replace(/(\S),/g, '$1,')
        .replace(/,(\S)/g, ', $1')
        .trim();

      return (
        <div key={cell.id} className='capitalize'>
          {user.deanId && <span>{deanName}</span>}
          {user.profileId && <span>{teacherName}</span>}
        </div>
      );
    },

    accessorFn: (row) => {
      const user = row;
      if (!user) return '';

      return `
        ${user.deanId ? `${user.deanId?.lastname ? user.deanId?.lastname + ',' : ''} ${user.deanId?.firstname ?? ''} ${user.deanId?.middlename ?? ''} ${user.deanId?.extensionName ?? ''}` : ''}
        ${user.profileId ? `${user.profileId?.lastname ? user.profileId?.lastname + ',' : ''} ${user.profileId?.firstname ?? ''} ${user.profileId?.middlename ?? ''} ${user.profileId?.extensionName ?? ''}` : ''}`
        .trim()
        .replace(/\s+,/g, ',')
        .replace(/,(\S)/g, ', $1')
        .replace(/\s+/g, ' ');
    },

    filterFn: (row, columnId, filterValue) => {
      const user = row.original;
      if (!user) return false;

      const fullName = `${user.profileId?.lastname ? user.profileId?.lastname + ',' : ''} ${user.profileId?.firstname ?? ''} ${user.profileId?.middlename ?? ''}${user.profileId?.extensionName ? ', ' + user.profileId?.extensionName + '.' : ''}`
        .replace(/\s+,/g, ',')
        .replace(/,(\S)/g, ', $1')
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .trim();

      const deanName = `${user.deanId?.lastname ? user.deanId?.lastname + ',' : ''} ${user.deanId?.firstname ?? ''} ${user.deanId?.middlename ?? ''}${user.deanId?.extensionName ? ', ' + user.deanId?.extensionName + '.' : ''}`
        .replace(/\s+,/g, ',')
        .replace(/,(\S)/g, ', $1')
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .trim();

      return fullName.includes(filterValue.toLowerCase()) || deanName.includes(filterValue.toLowerCase());
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
          {user?.category}
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
        <div key={cell.id} className=''>
          {user?.blockType?.section ?? 'N/A'}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.subject?.subjectCode,
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
    accessorFn: (row) => row.subject?.name,
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
    accessorFn: (row) => row.subject?.preReq,
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
    accessorFn: (row) => row.blockType?.year,
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
    accessorFn: (row) => row.schoolYear,
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
