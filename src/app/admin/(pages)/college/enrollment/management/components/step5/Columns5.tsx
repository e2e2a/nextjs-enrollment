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
import YearFilter from '../filters/YearFilter';
import SemesterFilter from '../filters/SemesterFilter';
import StudentStatusFilter from '../filters/StudentStatusFilter';
import COCFile from '../step1/COCFile';

export const columns5: ColumnDef<IEnrollment>[] = [
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

      const formattedName = `${user?.lastname ? user?.lastname + ',' : ''} ${user?.firstname ?? ''} ${user?.middlename ?? ''}${user?.extensionName ? ', ' + user?.extensionName : ''}`
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
      const user = row.profileId;
      return `${user?.lastname ? user?.lastname + ',' : ''} ${user?.firstname ?? ''} ${user?.middlename ?? ''}${user?.extensionName ? ', ' + user?.extensionName : ''}`.replace(/\s+,/g, ',').replace(/,(\S)/g, ', $1').replace(/\s+/g, ' ').toLowerCase().trim();
    },

    filterFn: (row, columnId, filterValue) => {
      const user = row.original.profileId;

      const fullName = `${user?.lastname ? user?.lastname + ',' : ''} ${user?.firstname ?? ''} ${user?.middlename ?? ''}${user?.extensionName ? ', ' + user?.extensionName : ''}`
        .replace(/\s+,/g, ',')
        .replace(/(\S),/g, '$1,')
        .replace(/,(\S)/g, ', $1')
        .trim()
        .toLowerCase();

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
        <div key={cell.id} className=''>
          {user?.courseId?.courseCode}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.studentYear,
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
    accessorFn: (row) => row?.studentSemester,
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
    accessorFn: (row) => row?.studentStatus,
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
  {
    accessorFn: (row) => row.profileId?.psaUrl,
    accessorKey: 'psa file',
    header: 'PSA file',
    cell: ({ row }) => {
      const user = row.original;
      return user?.profileId?.psaUrl ? <PSAFile user={user} /> : <span className=' text-red font-medium'>N/A</span>;
    },
  },
  {
    accessorFn: (row) => row.profileId?.goodMoralUrl,
    accessorKey: 'good moral',
    header: 'Good Moral',
    cell: ({ row }) => {
      const user = row.original;
      return user?.profileId?.goodMoralUrl ? <GoodMoralFile user={user} /> : <span className=' text-red font-medium'>N/A</span>;
    },
  },
  {
    accessorFn: (row) => row.profileId?.reportCardUrl,
    accessorKey: 'Report Card',
    header: 'Report Card',
    cell: ({ row }) => {
      const user = row.original;
      return user?.profileId?.reportCardUrl ? <ReportCardFile user={user} /> : <span className=' text-red font-medium'>N/A</span>;
    },
  },
  {
    accessorFn: (row) => row?.profileId?.cocUrl,
    accessorKey: 'Certification of Completion',
    header: 'Certification of Completion',
    cell: ({ row }) => {
      const user = row.original;
      return user?.profileId?.cocUrl ? <COCFile user={user} /> : <span className=' text-red font-medium'>N/A</span>;
    },
  },
  {
    accessorFn: (row) => row?.profileId?.photoUrl,
    accessorKey: 'student photo',
    header: 'Student Photo',
    cell: ({ row }) => {
      const user = row.original;
      return user?.profileId?.photoUrl ? <StudentPhoto user={user} /> : <span className=' text-red font-medium'>N/A</span>;
    },
  },
  {
    accessorFn: (row) => row?.profileId?.studentType,
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
    accessorFn: (row) => row.blockTypeId?.section,
    accessorKey: 'block type',
    header: 'Block Type',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.blockTypeId?.section ?? 'N/A'}
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
    accessorFn: (row) => row.profileId?.payment,
    accessorKey: 'payment status',
    header: 'Payment Status',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.payment ? <span className='text-green-500'>TRUE</span> : <span className='text-red'>FALSE</span>}
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
