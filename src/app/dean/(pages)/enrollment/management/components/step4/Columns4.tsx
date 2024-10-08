'use client';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown, ChevronsUpDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableDrawer } from '../Drawer';
import ActionsCell from './ActionsCell';
import { IEnrollment } from '@/types';
import StudentPhoto from '../step1/StudentPhoto';
import PSAFile from '../step1/PSAFile';
import ReportCardFile from '../step1/ReportCardFile';
import GoodMoralFile from '../step1/GoodMoralFile';

export const columns4: ColumnDef<IEnrollment>[] = [
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
    accessorKey: 'fullname',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          FullName
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' capitalize'>
          {user.profileId.lastname}, {user.profileId.firstname} {user.profileId.middlename}
        </div>
      );
    },
    accessorFn: (row) => {
      const { lastname, firstname, middlename } = row.profileId;
      return `${lastname}, ${firstname} ${middlename}`;
    },
    filterFn: (row, columnId, filterValue) => {
      const fullName = `${row.original.profileId.lastname}, ${row.original.profileId.firstname} ${row.original.profileId.middlename}`.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    },
  },

  {
    accessorFn: (row) => row.courseId.courseCode, // Use accessorFn for nested fields
    id: 'course Code',
    header: 'Course',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.courseId.courseCode}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.studentYear,
    accessorKey: 'student year',
    header: 'Student Year',
  },
  {
    accessorFn: (row) => row.studentSemester,
    accessorKey: 'student semester',
    header: 'Student Semester',
  },
  {
    accessorFn: (row) => row.studentStatus,
    accessorKey: 'student status',
    header: 'Student Status',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' capitalize'>
          {user.studentStatus}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.profileId.psaUrl,
    accessorKey: 'psa file',
    header: 'PSA file',
    cell: ({ row }) => {
      const user = row.original;

      return <PSAFile user={user} />;
    },
  },
  {
    accessorFn: (row) => row.profileId.goodMoralUrl,
    accessorKey: 'good moral',
    header: 'Good Moral',
    cell: ({ row }) => {
      const user = row.original;

      return <GoodMoralFile user={user} />;
    },
  },
  {
    accessorFn: (row) => row.profileId.reportCardUrl,
    accessorKey: 'Report Card',
    header: 'Report Card',
    cell: ({ row }) => {
      const user = row.original;

      return <ReportCardFile user={user} />;
    },
  },
  {
    accessorFn: (row) => row.profileId.photoUrl,
    accessorKey: 'student photo',
    header: 'Student Photo',
    cell: ({ row }) => {
      const user = row.original;

      return <StudentPhoto user={user} />;
    },
  },
  {
    accessorFn: (row) => row.blockTypeId.section,
    accessorKey: 'block type',
    header: 'Block Type',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.blockTypeId?.section && `block ${user.blockTypeId.section}`}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.schoolYear,
    accessorKey: 'school year',
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
    accessorFn: (row) => row.studentSubjects.length,
    accessorKey: 'Subjects Count',
    header: 'Subjects Count',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' '>
          {user.studentSubjects.length === 0 ? <span className='text-red'>{user.studentSubjects.length}</span> : <span className='text-green-500'>{user.studentSubjects.length}</span>}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.studentSubjects.request,
    accessorKey: 'request add',
    header: 'Request Add',
    cell: ({ cell, row }) => {
      const user = row.original;
      const requestAdd = user.studentSubjects.filter((s: any) => s.request === 'add');
      return (
        <div key={cell.id} className=' text-green-500'>
          {requestAdd.length}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.studentSubjects.request,
    accessorKey: 'request drop',
    header: 'Request Drop',
    cell: ({ cell, row }) => {
      const user = row.original;
      const requestDrop = user.studentSubjects.filter((s: any) => s.request === 'drop');
      return (
        <div key={cell.id} className='text-red '>
          {requestDrop.length}
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
      // @example for formatted date ex. January 1, 2015
      // const options: Intl.DateTimeFormatOptions = {
      //   year: "numeric",
      //   month: "short",
      //   day: "numeric",
      // };

      // const formattedDate = date.toLocaleDateString("en-US", options);

      // // Manually reformat the string to "Jul 20, 2024"
      // const [month, day, year] = formattedDate.split(' ');
      // const formatted = `${month} ${day}, ${year}`;
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
