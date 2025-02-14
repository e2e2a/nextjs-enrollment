'use client';
import { ColumnDef } from '@tanstack/react-table';
import ActionsCell from './ActionsCell';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import OptionsCell from './OptionsCell';

export const columns: ColumnDef<any>[] = [
  {
    accessorFn: (row) => '#',
    id: '#',
    header: '#',
    cell: ({ cell, row }) => {
      return (
        <div key={cell.id} className=' uppercase'>
          {row.index + 1}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId?.blockTypeId?.section,
    id: 'block type',
    header: 'Block Type',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user.teacherScheduleId?.blockTypeId?.section ?? 'N/A'}
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
        <div key={cell.id} className=''>
          {user.teacherScheduleId?.subjectId?.subjectCode}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId?.subjectId?.name,
    id: 'Descriptive Title',
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
    accessorFn: (row) => row.teacherScheduleId?.days,
    id: 'days',
    header: 'Days',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user?.teacherScheduleId?.days.join(', ')}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId?.subjectId?.lec,
    id: 'lec',
    header: 'Lec',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.teacherScheduleId?.subjectId?.lec}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId?.subjectId?.lab,
    id: 'lab',
    header: 'Lab',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.teacherScheduleId?.subjectId?.lab}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.teacherScheduleId?.subjectId?.unit,
    id: 'unit',
    header: 'Unit',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.teacherScheduleId?.subjectId?.unit}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId?.startTime,
    id: 'start time',
    header: 'Start Time',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user?.teacherScheduleId?.startTime}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId?.endTime,
    id: 'end time',
    header: 'End Time',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user?.teacherScheduleId?.endTime}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId?.roomId?.roomName,
    id: 'room',
    header: 'Room',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.teacherScheduleId?.roomId?.roomName}
        </div>
      );
    },
  },
  {
    accessorKey: 'Fullname',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Instructor
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ cell, row }) => {
      const user = row.original.teacherScheduleId;

      const formatName = (person: any) => {
        if (!person) return '';
        return `${person?.lastname ? person?.lastname + ',' : ''} ${person?.firstname ?? ''} ${person?.middlename ?? ''}${person?.extensionName ? ', ' + person?.extensionName + '.' : ''}`
          .replace(/\s+,/g, ',') // Fix spaces before commas
          .replace(/,(\S)/g, ', $1') // Ensure proper comma spacing
          .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
          .trim();
      };

      const instructorName = user.profileId ? formatName(user.profileId) : '';
      const deanName = user.deanId ? formatName(user.deanId) : '';

      return (
        <div key={cell.id} className='capitalize'>
          {deanName && <span>{deanName}</span>}
          {instructorName && <span>{instructorName}</span>}
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

      const instructorName = row.teacherScheduleId?.profileId ? formatName(row.teacherScheduleId.profileId) : '';
      const deanName = row.teacherScheduleId?.deanId ? formatName(row.teacherScheduleId.deanId) : '';

      return `${instructorName} ${deanName}`.trim();
    },

    filterFn: (row, columnId, filterValue) => {
      const user = row.original.teacherScheduleId;

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
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original;
      return <ActionsCell user={user} />;
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId.roomId.roomName,
    id: 'requesting',
    header: 'Requesting',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase '>
          {!user.request && <div className='text-gray-500 text-xs'>N/A</div>}
          {user.request && user.request === 'add' ? (
            <div className='text-green-500 text-xs font-bold'>Add</div>
          ) : user.request === 'drop' ? (
            <div className='text-red text-xs font-bold'>Drop</div>
          ) : user.request === 'suggested' ? (
            <div className='text-orange-300 text-xs font-bold'>Suggested</div>
          ) : null}
        </div>
      );
    },
  },
  {
    id: 'requestStatusInDean',
    header: 'Approved By Dean',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user.requestStatusInDean === 'Approved' ? (
            <span className='text-green-500 text-xs'>{user.requestStatusInDean}</span>
          ) : user.requestStatusInDean === 'Pending' ? (
            <span className='text-blue-500 text-xs'>{user.requestStatusInDean}</span>
          ) : user.requestStatusInDean === 'Declined' ? (
            <span className='text-red text-xs'>{user.requestStatusInDean}</span>
          ) : (
            <span className='text-gray-400 text-xs'>N/A</span>
          )}
        </div>
      );
    },
  },
  {
    id: 'requestStatusInRegistrar',
    header: 'Approved By Registrar',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user.requestStatusInRegistrar === 'Approved' ? (
            <span className='text-green-500 text-xs'>{user.requestStatusInRegistrar}</span>
          ) : user.requestStatusInRegistrar === 'Pending' ? (
            <span className='text-blue-500 text-xs'>{user.requestStatusInRegistrar}</span>
          ) : user.requestStatusInRegistrar === 'Declined' ? (
            <span className='text-red text-xs'>{user.requestStatusInRegistrar}</span>
          ) : (
            <span className='text-gray-400 text-xs'>N/A</span>
          )}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.firstGrade,
    id: 'prelim',
    header: 'Prelim',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user?.firstGrade}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.secondGrade,
    id: 'midterm',
    header: 'Midterm',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user?.secondGrade}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.thirdGrade,
    id: 'semi-final',
    header: 'Semi-final',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user?.thirdGrade}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.fourthGrade,
    id: 'final',
    header: 'Final',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user?.fourthGrade}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.averageTotal,
    id: 'averageTotal',
    header: 'Average Total',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user?.averageTotal}
        </div>
      );
    },
  },
  {
    id: 'options',
    header: 'Options',
    cell: ({ row }) => {
      const user = row.original;
      return <OptionsCell user={user} />;
    },
  },
];
