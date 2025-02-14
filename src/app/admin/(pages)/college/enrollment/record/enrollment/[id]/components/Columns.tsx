'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

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
    accessorFn: (row) => row.blockType.section,
    id: 'block type',
    header: 'Block Type',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          Block {user?.blockType?.section}
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
    id: 'Descriptive Title',
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
    accessorFn: (row) => row.subject?.lec,
    id: 'lec',
    header: 'Lec',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.subject?.lec}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.subject?.lab,
    id: 'lab',
    header: 'Lab',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.subject?.lab}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.subject?.unit,
    id: 'unit',
    header: 'Unit',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.subject?.unit}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.days,
    id: 'days',
    header: 'Days',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user?.days.join(', ')}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.startTime,
    id: 'start time',
    header: 'Start Time',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user?.startTime}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.endTime,
    id: 'end time',
    header: 'End Time',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user?.endTime}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.roomId?.roomName,
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
      const user = row.original.teacher;

      const formattedName = `${user?.lastname ? user?.lastname + ',' : ''} ${user?.firstname ?? ''} ${user?.middlename ?? ''}${user?.extensionName ? ', ' + user?.extensionName + '.' : ''}`
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
      const user = row.teacher;
      return `${user?.lastname ? user?.lastname + ',' : ''} ${user?.firstname ?? ''} ${user?.middlename ?? ''}${user?.extensionName ? ', ' + user?.extensionName + '.' : ''}`
        .replace(/\s+,/g, ',')
        .replace(/,(\S)/g, ', $1')
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .trim();
    },

    filterFn: (row, columnId, filterValue) => {
      const user = row.original.teacher;

      const fullName = `${user?.lastname ? user?.lastname + ',' : ''} ${user?.firstname ?? ''} ${user?.middlename ?? ''}${user?.extensionName ? ', ' + user?.extensionName + '.' : ''}`
        .replace(/\s+,/g, ',')
        .replace(/,(\S)/g, ', $1')
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .trim();

      return fullName.includes(filterValue.toLowerCase());
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
  // /**
  //  * @todo
  //  * uncomment this action and do some request drop subject
  //  */
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
