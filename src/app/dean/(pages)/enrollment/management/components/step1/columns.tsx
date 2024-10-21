'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogStep1Button } from './Dialog';
import ActionsCell from './ActionsCell';
import { IEnrollment } from '@/types';
import PSAFile from './PSAFile';
import StudentPhoto from './StudentPhoto';
import GoodMoralFile from './GoodMoralFile';
import ReportCardFile from './ReportCardFile';
import YearFilter from '../filters/YearFilter';
import SemesterFilter from '../filters/SemesterFilter';
import StudentStatusFilter from '../filters/StudentStatusFilter';

export const columns: ColumnDef<IEnrollment>[] = [
  {
    accessorFn: (row, index) => index + 1,
    accessorKey: '#',
    header: '#',
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
      const fullName = `${row.original.profileId.lastname}, ${row.original.profileId.firstname}`.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    },
  },

  {
    accessorFn: (row) => row.courseId.courseCode, // Use accessorFn for nested fields
    id: 'course code',
    header: 'Course Code',
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
    header: ({ column }) => (
      <YearFilter
        onChange={(role: string | null) => {
          column.setFilterValue(role);
        }}
      />
    ),
  },
  {
    accessorFn: (row) => row.studentSemester,
    accessorKey: 'student semester',
    header: ({ column }) => (
      <SemesterFilter
        onChange={(role: string | null) => {
          column.setFilterValue(role);
        }}
      />
    ),
  },
  {
    accessorFn: (row) => row.studentStatus,
    accessorKey: 'student status',
    header: ({ column }) => (
      <StudentStatusFilter
        onChange={(role: string | null) => {
          column.setFilterValue(role);
        }}
      />
    ),
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
