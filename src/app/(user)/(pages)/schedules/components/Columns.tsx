'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import ActionsCell from './ActionsCell';

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
    accessorFn: (row) => row.teacherScheduleId.blockTypeId.section,
    id: 'block type',
    header: 'Block Type',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          Block {user.teacherScheduleId.blockTypeId.section}
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
    id: 'Descriptive Title',
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
    accessorFn: (row) => row.teacherScheduleId.subjectId.lec,
    id: 'lec',
    header: 'Lec',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user.teacherScheduleId.subjectId.lec}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId.subjectId.lab,
    id: 'lab',
    header: 'Lab',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user.teacherScheduleId.subjectId.lab}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId.subjectId.unit,
    id: 'unit',
    header: 'Unit',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user.teacherScheduleId.subjectId.unit}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId.days,
    id: 'days',
    header: 'Days',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user.teacherScheduleId.days.join(', ')}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId.startTime,
    id: 'start time',
    header: 'Start Time',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user.teacherScheduleId.startTime}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacherScheduleId.endTime,
    id: 'end time',
    header: 'End Time',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user.teacherScheduleId.endTime}
        </div>
      );
    },
  },

  {
    accessorFn: (row) => row.teacherScheduleId.roomId.roomName,
    id: 'room name',
    header: 'Room Name',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user.teacherScheduleId.roomId.roomName}
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
      const user = row.original;
      return (
        <div key={cell.id} className='capitalize'>
          {user.teacherScheduleId.profileId.firstname} {user.teacherScheduleId.profileId.middlename} {user.teacherScheduleId.profileId.lastname} {user.teacherScheduleId.profileId.extensionName ? user.teacherScheduleId.profileId.extensionName : ''}
        </div>
      );
    },
    accessorFn: (row) =>
      `${row.teacherScheduleId.profileId.firstname} ${row.teacherScheduleId.profileId.middlename} ${row.teacherScheduleId.profileId.lastname} ${row.teacherScheduleId.profileId.extensionName ? row.teacherScheduleId.profileId.extensionName : ''}`,
    filterFn: (row, columnId, filterValue) => {
      const user = row.original;
      const fullName = `${user.teacherScheduleId.profileId.firstname} ${user.teacherScheduleId.profileId.middlename} ${user.teacherScheduleId.profileId.lastname} ${
        user.teacherScheduleId.profileId.extensionName ? user.teacherScheduleId.profileId.extensionName : ''
      }`.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    },
  },
  {
    id: 'grade',
    header: 'Grade',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user.grade}
        </div>
      );
    },
  },
  //show this col if row.profileId.enrollStatus !== 'Enrolled
  // {
  //   accessorFn: (row) => {return false},
  //   id: 'status',
  //   header: 'Status',
  //   cell: ({ cell, row }) => {
  //     const user = row.original;
  //     return (
  //       <div key={cell.id} className=''>
  //         {user.profileId.enrollStatus !== 'Enrolled' ? user.status : null}
  //       </div>
  //     );
  //   },
  // },
  {
    id: 'status',
    header: 'Status',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase font-bold'>
          {user.status?.toLowerCase() === 'approved' ? (
            <span className='text-green-500 text-xs'>{user.status}</span>
          ) : user.status?.toLowerCase() === 'pending' ? (
            <span className='text-blue-500 text-xs'>{user.status}</span>
          ) : user.status?.toLowerCase() === 'suggested' ? (
            <span className='text-orange-500 text-xs'>{user.status}</span>
          ) : user.status?.toLowerCase() === 'dropped' ? (
            <span className='text-red text-xs'>{user.status}</span>
          ) : user.status?.toLowerCase() === 'declined' ? (
            <span className='text-red text-xs'>{user.status}</span>
          ) : null}
        </div>
      );
    },
  },
  /**
   * @todo
   * uncomment this action and do some request drop subject
   */
  {
    accessorFn: (row) => row.request,
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
    id: 'request',
    header: 'Request',
    cell: ({ row }) => {
      const user = row.original;
      return <ActionsCell user={user} />;
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
            <span className='text-gray-400 font-normal text-xs'>N/A</span>
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
            <span className='text-gray-400 font-normal text-xs'>N/A</span>
          )}
        </div>
      );
    },
  },
  {
    id: 'request status',
    header: 'Request Status',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase font-bold'>
          {user.requestStatus?.toLowerCase() === 'approved' ? (
            <span className='text-green-500 text-xs'>{user.requestStatus}</span>
          ) : user.requestStatus?.toLowerCase() === 'pending' ? (
            <span className='text-blue-500 text-xs'>{user.requestStatus}</span>
          ) : user.requestStatus?.toLowerCase() === 'declined' ? (
            <span className='text-red text-xs'>{user.requestStatus}</span>
          ) : user.requestStatus?.toLowerCase() === 'suggested' ? (
            <span className='text-orange-500 text-xs'>{user.requestStatus}</span>
          ) : (
            <span className='text-gray-400 font-normal text-xs'>N/A</span>
          )}
        </div>
      );
    },
  },
];
