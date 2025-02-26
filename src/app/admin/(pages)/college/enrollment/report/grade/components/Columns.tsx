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
          .replace(/\s+,/g, ',') // Fix spaces before commas
          .replace(/,(\S)/g, ', $1') // Ensure proper comma spacing
          .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
          .trim();
      };

      const teacherName = user.teacherId ? formatName(user.teacherId) : '';
      const deanName = user.deanId ? formatName(user.deanId) : '';

      return (
        <div key={cell.id} className='capitalize'>
          {deanName && <span>{deanName}</span>}
          {teacherName && <span>{teacherName}</span>}
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

      const teacherName = row.teacherId ? formatName(row.teacherId) : '';
      const deanName = row.deanId ? formatName(row.deanId) : '';

      return `${teacherName} ${deanName}`.trim();
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

      const teacherName = user?.teacherId ? formatNameForSearch(user.teacherId) : '';
      const deanName = user?.deanId ? formatNameForSearch(user.deanId) : '';

      return teacherName.includes(filterValue.toLowerCase()) || deanName.includes(filterValue.toLowerCase());
    },
  },

  {
    accessorFn: (row) => row.teacherScheduleId?.courseId?.courseCode,
    id: 'course code',
    header: 'Course Code',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.teacherScheduleId?.courseId?.courseCode}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId?.blockTypeId?.section,
    id: 'block',
    header: 'Block',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.teacherScheduleId?.blockTypeId?.section}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId?.subjectId?.subjectCode,
    id: 'subject code',
    header: 'Subject Code',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' '>
          {user?.teacherScheduleId?.subjectId?.subjectCode}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId?.subjectId?.name,
    id: 'descriptive title',
    header: 'Descriptive Title',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.teacherScheduleId?.subjectId?.name}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId?.blockTypeId?.year,
    id: 'year',
    header: 'Year',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.teacherScheduleId?.blockTypeId?.year}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId?.blockTypeId?.semester,
    id: 'semester',
    header: 'Semester',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.teacherScheduleId?.blockTypeId?.semester}
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
    accessorFn: (row) => row.schoolYear,
    id: 'schoolYear',
    header: 'School Year',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.schoolYear ?? ''}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.requestType,
    id: 'requestType',
    header: 'Request Type',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.requestType === 'Class Report' && user?.requestType}
          {user?.requestType === 'Individual' && `${user?.requestType} Report`}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.statusInDean,
    id: 'Approved By Dean',
    header: 'Approved By Dean',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='font-bold uppercase'>
          {user?.statusInDean && user.statusInDean === 'Pending' && <span className='text-blue-500'>{user?.statusInDean}</span>}
          {user?.statusInDean && user.statusInDean === 'Approved' && <span className='text-green-500'>{user?.statusInDean}</span>}
          {user?.statusInDean && user.statusInDean === 'Declined' && <span className='text-red'>{user?.statusInDean}</span>}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.evaluated,
    id: 'Verify',
    header: 'Verify',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase font-bold'>
          {user?.evaluated ? <span className='text-green-500'>Verified</span> : <span className='text-red'>Not Verified</span>}
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
