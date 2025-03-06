'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ActionsCell from './ActionsCell';
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
        <div key={cell.id} className=''>
          {user?.roomName}
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
    accessorFn: (row) => row?.roomType,
    id: 'roomType',
    header: 'Room Type',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.roomType}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.floorLocation,
    id: 'floorLocation',
    header: 'Floor Location',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.floorLocation ? user?.floorLocation : 'N/A'}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row?.isRoomAvailable,
    id: 'isRoomAvailable',
    header: 'isRoomAvailable',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.isRoomAvailable ? 'TRUE' : 'FALSE'}
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
];
