// @ts-nocheck
'use client';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown, ChevronsUpDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { DataTableDrawer } from '../Drawer';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/shared/Icons';
import { useApprovedEnrollmentStep1Mutation } from '@/lib/queries';
import { useState } from 'react';
import ActionsCell2 from './ActionsCell';

interface Enrollment {
  id: string;
  userId: any;
  courseId: any;
  studentYear: string;
  studentSemester: string;
  step: any;
  createdAt: Date;
  updatedAt: Date;
}
export const columns2: ColumnDef<Enrollment>[] = [
  {
    accessorKey: 'fullname',
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
      return (
        <div key={cell.id} className=' capitalize'>
          {user.profileId.lastname}, {user.profileId.firstname} {user.profileId.middlename}
        </div>
      );
    },
    // accessorFn: (row) => console.log('row', row.orignal),
    filterFn: (row, columnId, filterValue) => {
      const fullName = `${row.original.profileId.lastname}, ${row.original.profileId.firstname}`.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    },
  },

  {
    accessorFn: (row) => row.courseId.courseCode, // Use accessorFn for nested fields
    id: 'courseCode',
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
    accessorKey: 'Student Year',
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
  },
  {
    accessorFn: (row) => row.blockType,
    accessorKey: 'Block Type',
    header: 'Block Type',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='capitalize'>
          Block {user.blockType}
        </div>
      );
    },
  },
  //   {
  //     accessorKey: 'emailVerified',
  //     // header: 'Email Verified',
  //     header: ({ column }) => (
  //       <EmailVerifiedFilter
  //         onChange={(emailVerified: string | null) => {
  //           // Your custom logic to filter based on role
  //           column.setFilterValue(emailVerified);
  //         }}
  //       />
  //     ),
  //     cell: ({ row }) => {
  //       const emailVerified: string | null = row.getValue('emailVerified');
  //       const formatted = emailVerified ? new Date(emailVerified).toLocaleDateString() : 'Not Verified';
  //       return <div className='font-medium'>{formatted}</div>;
  //     },
  //     filterFn: (row, columnId, filterValue) => {
  //       // Custom filter function for role column
  //       // if (filterValue === null) return true;
  //       switch (filterValue) {
  //         case 'Not Verified':
  //           return row.original.emailVerified === null;
  //         case 'Verified':
  //           return row.original.emailVerified !== null;
  //         default:
  //           return true; // Default to showing all rows if no filter value is provided
  //       }
  //       // return row.original.emailVerified !== null;
  //     },
  //   },
  //   {
  //     accessorKey: 'role',
  //     // header: 'Role'
  //     header: ({ column }) => (
  //       <RoleFilter
  //         onChange={(role: string | null) => {
  //           // Your custom logic to filter based on role
  //           column.setFilterValue(role);
  //         }}
  //       />
  //     ),
  //     filterFn: (row, columnId, filterValue) => {
  //       // Custom filter function for role column
  //       if (filterValue === null) return true;
  //       return row.original.role === filterValue;
  //     },
  //   },
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
      // const mutation = useApprovedEnrollmentStep1Mutation();
      const user = row.original;
      // const actionFormSubmit = () => {
      //   setIsPending(true);
      //   const data = {
      //     EId: user._id,
      //   };
      //   mutation.mutate(data, {
      //     onSuccess: (res) => {
      //       console.log(res);
      //       switch (res.status) {
      //         case 200:
      //         case 201:
      //         case 203:
      //           // setTypeMessage('success');
      //           // setMessage(res?.message);
      //           // return (window.location.href = '/');
      //           console.log(res);
      //           return;
      //         default:
      //           //create maketoast
      //           setIsPending(false);
      //           // setMessage(res.error);
      //           // setTypeMessage('error');
      //           return;
      //       }
      //     },
      //     onSettled: () => {},
      //   });
      // };
      return (
        <ActionsCell2 user={user} />
      );
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
