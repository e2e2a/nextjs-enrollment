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
          Student Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' capitalize'>
          {user.profileId.lastname}, {user.profileId.firstname} {user.profileId.middlename ? user.profileId.middlename + '.' : ''} {user.profileId.middlename}
        </div>
      );
    },
    accessorFn: (row) => {
      const { profileId } = row;
      return `${profileId}`;
    },
    filterFn: (row, columnId, filterValue) => {
      const fullName = `${row.original.profileId.lastname}, ${row.original.profileId.firstname} ${row.original.profileId.middlename ? row.original.profileId.middlename + '.' : ''} ${row.original.profileId.middlename}`.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    },
  },

  // {
  //   accessorFn: (row) => row.teacherScheduleId.courseId.courseCode,
  //   id: 'course code',
  //   header: 'Course Code',
  //   cell: ({ cell, row }) => {
  //     const user = row.original;
  //     return (
  //       <div key={cell.id} className=' uppercase'>
  //         {user.teacherScheduleId.courseId.courseCode}
  //       </div>
  //     );
  //   },
  // },
  {
    accessorFn: (row) => row.profileId.sex,
    id: 'gender',
    header: 'Gender',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.profileId.sex}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.grade,
    id: 'grade',
    header: 'Grade',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase font-bold'>
          {user.grade}
        </div>
      );
    },
  },
  // {
  //   accessorFn: (row) => row.floorLocation, // Use accessorFn for nested fields
  //   id: 'floorLocation',
  //   header: 'floorLocation',
  //   cell: ({ cell, row }) => {
  //     const user = row.original;
  //     return (
  //       <div key={cell.id} className=' uppercase'>
  //         {user.floorLocation ? user.floorLocation : 'N/A'}
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorFn: (row) => row.isRoomAvailable, // Use accessorFn for nested fields
  //   id: 'isRoomAvailable',
  //   header: 'isRoomAvailable',
  //   cell: ({ cell, row }) => {
  //     const user = row.original;
  //     return (
  //       <div key={cell.id} className=' uppercase'>
  //         {user.isRoomAvailable ? 'TRUE' : 'FALSE'}
  //       </div>
  //     );
  //   },
  // },

  // {
  //   id: 'actions',
  //   header: 'Actions',
  //   cell: ({ row }) => {
  //     const user = row.original;
  //     return (
  //       <div className=''>
  //         <div className='flex justify-center items-center w-full gap-1'>
  //           <Button role='combobox' size={'sm'} className={'w-auto focus-visible:ring-0 flex bg-green-500 px-2 py-0 gap-x-1 text-neutral-50 font-medium'}>
  //             Make an appointment
  //             <Icons.check className='h-4 w-4' />
  //           </Button>
  //           <Button role='combobox' size={'sm'} className={'w-auto focus-visible:ring-0 flex bg-red px-2 py-0 gap-x-1 text-neutral-50 font-medium'}>
  //             Reject
  //             <Icons.close className='h-4 w-4' />
  //           </Button>
  //         </div>
  //       </div>
  //     );
  //   },
  // },
];
