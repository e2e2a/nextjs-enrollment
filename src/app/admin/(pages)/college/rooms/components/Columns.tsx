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
import { IRoom } from '@/types';

export const columns: ColumnDef<IRoom>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Room Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' capitalize'>
          {user.roomName}
        </div>
      );
    },
    accessorFn: (row) => {
      const { roomName } = row;
      return `${roomName}`;
    },
    filterFn: (row, columnId, filterValue) => {
      const fullName = `${row.original.roomName}`.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    },
  },

  {
    accessorFn: (row) => row.roomType, // Use accessorFn for nested fields
    id: 'roomType',
    header: 'roomType',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.roomType}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.floorLocation, // Use accessorFn for nested fields
    id: 'floorLocation',
    header: 'floorLocation',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.floorLocation ? user.floorLocation : 'N/A'}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.isRoomAvailable, // Use accessorFn for nested fields
    id: 'isRoomAvailable',
    header: 'isRoomAvailable',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.isRoomAvailable ? 'TRUE' : 'FALSE'}
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
