'use client';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown, ChevronsUpDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/shared/Icons';
import { useApprovedEnrollmentStep1Mutation } from '@/lib/queries';
import { useState } from 'react';
import ActionsCell from './ActionsCell';
import Image from 'next/image';
import { ITeacherSchedule } from '@/types';

export const columns: ColumnDef<ITeacherSchedule>[] = [
  // {
  //   accessorFn: (row) => row.subjectCode,
  //   accessorKey: 'subjectCode',
  //   header: 'subjectCode',
  //   cell: ({ cell, row }) => {
  //     const user = row.original;
  //     console.log(user);
  //     return (
  //       <div key={cell.id} className='flex justify-center items-center'>
  //           {user.subjectCode}
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ cell, row }) => {
      const user = row.original;
      return <div key={cell.id}>{user.profileId.lastname && user.profileId.firstname ? user.profileId.lastname + ',' + ' ' + user.profileId.firstname + ' ' + user.profileId.middlename : 'Unknown'}</div>;
    },
    accessorFn: (row) => `${row.profileId.lastname}, ${row.profileId.firstname} ${row.profileId.middlename}`,
    filterFn: (row, columnId, filterValue) => {
      const user = row.original;
      const fullName = `${row.original.profileId.lastname}, ${row.original.profileId.firstname} ${row.original.profileId.middlename}`.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorFn: (row) => row.schedule, // Use accessorFn for nested fields
    id: 'schedule',
    header: 'Schedule',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {/* {Array.isArray(user.schedule) ? user.schedule.length : 0} */}
          {user.schedule.length}
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
  // {
  //   id: 'actions',
  //   header: 'Actions',
  //   cell: ({ row }) => {
  //     const user = row.original;

  //     return (
  //       <DropdownMenu modal={false}>
  //         <DropdownMenuTrigger asChild>
  //           <div className='flex justify-center items-center w-full'>
  //             <Button size={'sm'} className='w-auto focus-visible:ring-0 flex bg-blue-500 px-2 py-0 text-neutral-50 font-medium'>
  //               <span className='sr-only'>Open menu</span>
  //               Options
  //             </Button>
  //           </div>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align='end' className='bg-white'>
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user._id)}>Copy user ID</DropdownMenuItem>
  //           <DropdownMenuItem>
  //             <DataTableDrawer user={user} />
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>
  //             <Link href={`/profile/${user.userId.username}`}>View profile</Link>
  //           </DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original;

      return <ActionsCell user={user} />;
    },
  },
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
