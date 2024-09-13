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

interface ICourse {
  id: string;
  courseCode: string;
  name: string;
  imageUrl: string;
  description?: Date;
  createdAt: Date;
  updatedAt: Date;
}
export const columns: ColumnDef<ICourse>[] = [
  {
    accessorFn: (row) => row.imageUrl,
    accessorKey: 'course image',
    header: 'Course Image',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='flex justify-center items-center'>
            { user.imageUrl ? 
            <Image className='w-20 h-12 border rounded-md shadow-sm drop-shadow-sm' src={`${user.imageUrl}`} alt={`${user.courseCode}`} width={100} priority height={100} />:
            <div className='flex justify-center items-center'>
              No Photo
            </div>

            }
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
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
          {user.name}
        </div>
      );
    },
    accessorFn: (row) => {
      const { name } = row;
      return `${name}`;
    },
    filterFn: (row, columnId, filterValue) => {
      const fullName = `${row.original.name}`.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    },
  },

  {
    accessorFn: (row) => row.courseCode, // Use accessorFn for nested fields
    id: 'course Code',
    header: 'Course',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.courseCode}
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
