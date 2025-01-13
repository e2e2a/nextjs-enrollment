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
      return (
        <div key={cell.id} className=' capitalize'>
         {user.profileId && <span> {user.profileId.firstname ?? ''} {user.profileId.middlename ?? ''} {user.profileId.lastname ?? ''} {user.profileId.extensionName ? user.profileId.extensionName + '.' : ''}</span> }
         {user.deanId && <span> {user.deanId.firstname ?? ''} {user.deanId.middlename ?? ''} {user.deanId.lastname ?? ''} {user.deanId.extensionName ? user.deanId.extensionName + '.' : ''}</span> }
        </div>
      );
    },
    accessorFn: (row) =>
      `
    ${row.profileId && `${row.profileId?.firstname} ${row.profileId?.middlename ?? ''} ${row.profileId?.lastname} ${row.profileId?.extensionName ?? ''}`}
    ${row.deanId && `${row.deanId?.firstname} ${row.deanId?.middlename ?? ''} ${row.deanId?.lastname} ${row.deanId?.extensionName ?? ''}`}
    `.trim(),
    filterFn: (row, columnId, filterValue) => {
      const user = row.original;
      const fullName = `${user.profileId?.firstname ?? ''} ${user.profileId?.middlename ?? ''} ${user.profileId?.lastname ?? ''} ${user.profileId?.extensionName ?? ''}`.toLowerCase().trim();
      const deanName = `${user.deanId?.firstname ?? ''} ${user.deanId?.middlename ?? ''} ${user.deanId?.lastname ?? ''} ${user.deanId?.extensionName ?? ''}`.toLowerCase().trim();
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
          {user.category}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.course.courseCode,
    id: 'course code',
    header: 'Course Code',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.course.courseCode}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.blockType,
    id: 'block',
    header: 'Block',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.blockType?.section && 'BLOCK' + ' ' + user.blockType.section}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.subject.subjectCode,
    id: 'subject code',
    header: 'Subject Code',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.subject?.subjectCode}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.subject.name,
    id: 'descriptive title',
    header: 'Descriptive Title',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.subject.name}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.blockType.year,
    id: 'year',
    header: 'Year',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.blockType.year}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.blockType.semester,
    id: 'semester',
    header: 'Semester',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.blockType.semester}
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
        <div key={cell.id} className=' uppercase'>
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
          {user.schoolYear}
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
