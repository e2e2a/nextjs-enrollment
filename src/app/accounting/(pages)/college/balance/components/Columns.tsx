'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ActionsCell from './ActionsCell';
import { IEnrollment } from '@/types';
// import PSAFile from '../../management/components/step1/PSAFile';
// import ReportCardFile from '../../management/components/step1/ReportCardFile';
// import GoodMoralFile from '../../management/components/step1/GoodMoralFile';
import StudentPhoto from '../../components/StudentPhoto';
import YearFilter from '../../components/filters/YearFilter';
import SemesterFilter from '../../components/filters/SemesterFilter';
import StudentStatusFilter from '../../components/filters/StudentStatusFilter';

export const columns: ColumnDef<IEnrollment>[] = [
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
      const user = row.original.profileId;
      const name = `${user?.lastname ? user?.lastname + ',' : ''} ${user?.firstname ?? ''} ${user?.middlename ?? ''}${user?.extensionName ? ', ' + user?.extensionName : ''}`.replace(/\s+,/g, ',').replace(/(\S),/g, '$1,').replace(/,(\S)/g, ', $1').trim();
      return (
        <div key={cell.id} className=' capitalize'>
          {name}
        </div>
      );
    },
    accessorFn: (row) => {
      const { lastname, firstname, middlename, extensionName } = row.profileId;

      return `${lastname ? lastname + ',' : ''} ${firstname ?? ''} ${middlename ?? ''}${extensionName ? ', ' + extensionName : ''}`.replace(/\s+,/g, ',').replace(/,(\S)/g, ', $1').replace(/\s+/g, ' ').trim();
    },

    filterFn: (row, columnId, filterValue) => {
      const user = row.original.profileId;

      const fullName = `${user?.lastname ? user?.lastname + ',' : ''} ${user?.firstname ?? ''} ${user?.middlename ?? ''}${user?.extensionName ? ', ' + user?.extensionName : ''}`
        .replace(/\s+,/g, ',')
        .replace(/,(\S)/g, ', $1')
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .trim();

      return fullName.includes(filterValue.toLowerCase());
    },
  },

  {
    accessorFn: (row) => row.courseId?.courseCode, // Use accessorFn for nested fields
    id: 'course code',
    header: 'Course Code',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.courseId?.courseCode}
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
          {user?.studentStatus}
        </div>
      );
    },
  },
  // {
  //   accessorFn: (row) => row.profileId?.psaUrl,
  //   accessorKey: 'psa file',
  //   header: 'PSA file',
  //   cell: ({ row }) => {
  //     const user = row.original;

  //     return <PSAFile user={user} />;
  //   },
  // },
  // {
  //   accessorFn: (row) => row.profileId?.goodMoralUrl,
  //   accessorKey: 'good moral',
  //   header: 'Good Moral',
  //   cell: ({ row }) => {
  //     const user = row.original;

  //     return <GoodMoralFile user={user} />;
  //   },
  // },
  // {
  //   accessorFn: (row) => row.profileId?.reportCardUrl,
  //   accessorKey: 'Report Card',
  //   header: 'Report Card',
  //   cell: ({ row }) => {
  //     const user = row.original;

  //     return <ReportCardFile user={user} />;
  //   },
  // },
  {
    accessorFn: (row) => row.profileId?.photoUrl,
    accessorKey: 'student photo',
    header: 'Student Photo',
    cell: ({ row }) => {
      const user = row.original;

      return <StudentPhoto user={user} />;
    },
  },
  {
    accessorFn: (row) => row.blockTypeId?.section,
    accessorKey: 'block type',
    header: 'Block Type',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.blockTypeId?.section && `block ${user?.blockTypeId?.section}`}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.profileId?.studentType,
    accessorKey: 'student type',
    header: 'Student Type',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.profileId?.studentType}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.schoolYear,
    accessorKey: 'school year',
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
    accessorFn: (row) => row.studentSubjects?.length,
    accessorKey: 'Subjects Count',
    header: 'Subjects Count',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' '>
          {user?.studentSubjects?.length === 0 ? <span className='text-red'>{user?.studentSubjects?.length}</span> : <span className='text-green'>{user?.studentSubjects?.length}</span>}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.enrollStatus,
    accessorKey: 'enrollment status',
    header: 'Enrollment Status',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' capitalize'>
          {user?.enrollStatus?.toLowerCase() === 'enrolled' ? <span className='text-green-500'>{user?.enrollStatus}</span> : <span className='text-gren-500'>{user?.enrollStatus}</span>}
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
