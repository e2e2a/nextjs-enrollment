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
          {user.teacherId.firstname} {user.teacherId.middlename ?? ''} {user.teacherId.lastname} {user.teacherId.extensionName ? user.teacherId.extensionName + '.' : ''}
        </div>
      );
    },
    accessorFn: (row) => {
      const { lastname, firstname, middlename, extensionName } = row.teacherId;
      return `${firstname ?? ''} ${middlename ?? ''} ${lastname ?? ''} ${extensionName ?? ''}`.trim();
    },
    filterFn: (row, columnId, filterValue) => {
      const fullName = `${row.original.teacherId.firstname ?? ''} ${row.original.teacherId.middlename ?? ''} ${row.original.teacherId.lastname ?? ''} ${row.original.teacherId.extensionName ?? ''}`.toLowerCase().trim();
      return fullName.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId.courseId.courseCode,
    id: 'course code',
    header: 'Course Code',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.teacherScheduleId.courseId.courseCode}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId.blockTypeId.section,
    id: 'block',
    header: 'Block',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.teacherScheduleId.blockTypeId.section && 'BLOCK' + ' ' + user.teacherScheduleId.blockTypeId.section}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId.subjectId.subjectCode,
    id: 'subject code',
    header: 'Subject Code',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.teacherScheduleId.subjectId.subjectCode}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId.subjectId.name,
    id: 'descriptive title',
    header: 'Descriptive Title',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.teacherScheduleId.subjectId.name}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId.blockTypeId.year,
    id: 'year',
    header: 'Year',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.teacherScheduleId.blockTypeId.year}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId.blockTypeId.semester,
    id: 'semester',
    header: 'Semester',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.teacherScheduleId.blockTypeId.semester}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.type,
    id: 'type',
    header: 'Type',
    cell: ({ cell, row }) => {
      const type = row.original?.type;
      return (
        <div key={cell.id} className=' uppercase'>
          {type === 'firstGrade' && 'Prelim'}
          {type === 'secondGrade' && 'Midterm'}
          {type === 'thirdGrade' && 'Semi-final'}
          {type === 'fourthGrade' && 'Final'}
          {''} Grade
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.statusInDean,
    id: 'Approved By Dean',
    header: 'Approved By Dean',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.statusInDean && user.statusInDean === 'Pending' && <span className='text-blue-500'>{user.statusInDean}</span>}
          {user.statusInDean && user.statusInDean === 'Approved' && <span className='text-green-500'>{user.statusInDean}</span>}
          {user.statusInDean && user.statusInDean === 'Declined' && <span className='text-red'>{user.statusInDean}</span>}
          {/* {user.statusInDean} */}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.statusInDean,
    id: 'Evaluated',
    header: 'Evaluated',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase font-bold'>
          {user.evaluated ? <span className='text-green-500'>True</span> : <span className='text-blue-500'>False</span>}
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
