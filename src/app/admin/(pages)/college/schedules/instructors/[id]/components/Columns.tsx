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

export const columns: ColumnDef<any>[] = [
  // {
  //   accessorFn: (row) => row.teacherScheduleId.blockTypeId.section, // Use accessorFn for nested fields
  //   id: 'block type',
  //   header: 'Block Type',
  //   cell: ({ cell, row }) => {
  //     const user = row.original;
  //     return (
  //       <div key={cell.id} className=' uppercase'>
  //         {user.teacherScheduleId.blockTypeId && user.teacherScheduleId.blockTypeId.section ? `Block ${user.teacherScheduleId.blockTypeId.section}` : 'No assign block type'}
  //       </div>
  //     );
  //   },
  // },
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
    accessorFn: (row) => row.subjectId.subjectCode,
    id: 'subject code',
    header: 'Subject Code',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.subjectId.subjectCode}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.subjectId.name,
    id: 'subject title',
    header: 'Subject Title',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.subjectId.name}
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
          {user.days.join(', ')}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.startTime,
    id: 'start time',
    header: 'Start Time',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user.startTime}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.endTime,
    id: 'end time',
    header: 'End Time',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className='uppercase'>
          {user.endTime}
        </div>
      );
    },
  },
  // {
  //   accessorKey: 'Descriptive Title',
  //   header: ({ column }) => {
  //     return (
  //       <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
  //         Descriptive Title
  //         <ArrowUpDown className='ml-2 h-4 w-4' />
  //       </Button>
  //     );
  //   },
  //   cell: ({ cell, row }) => {
  //     const user = row.original;
  //     return <div key={cell.id}>{user.subjectId.name}</div>;
  //   },
  //   accessorFn: (row) => `${row.subjectId.name}`,
  //   filterFn: (row, columnId, filterValue) => {
  //     const user = row.original;
  //     const fullName = `${user.subjectId.name}`.toLowerCase();
  //     return fullName.includes(filterValue.toLowerCase());
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
