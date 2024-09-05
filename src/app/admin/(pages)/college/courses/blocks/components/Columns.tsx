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
import ActionsCell from './ActionsCell';
import Image from 'next/image';

interface IBlockType {
  courseId: any;
  semester: string;
  year: string;
  section: string;
  createdAt: Date;
  updatedAt: Date;
}
export const columns: ColumnDef<IBlockType>[] = [
  {
    accessorFn: (row) => {
        const { section } = row;
        return `${section}`;
      },
    accessorKey: 'section',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Block Type
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.section}
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const section = `${row.original.section}`.toLowerCase();
      return section.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorFn: (row) => row.courseId.name, // Use accessorFn for nested fields
    id: 'course',
    header: 'Course',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' capitalize'>
          {user.courseId.name}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.semester,
    accessorKey: 'year',
    header: 'Year',
  },
  {
    accessorFn: (row) => row.year,
    accessorKey: 'semester',
    header: 'Semester',
  },
//   {
//     accessorFn: (row) => row.studentStatus,
//     accessorKey: 'student status',
//     header: 'Student Status',
//   },
  {
    accessorKey: 'createdAt',
    header: 'CreatedAt',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      const formatted = date.toLocaleDateString();
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
];
