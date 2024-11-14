'use client';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import RoleFilter from './RoleFilter';
import EmailVerifiedFilter from './EmailVerifiedFilter';
import { IStudentProfile } from '@/types';

export const columns: ColumnDef<IStudentProfile>[] = [
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
      return (
        <div key={cell.id} className='capitalize'>
          {user.lastname && user.firstname ? `${user.firstname} ${user.middlename} ${user.lastname} ${user.extensionName ? user.extensionName + '.' : ''}` : 'Unknown'}
        </div>
      );
    },
    accessorFn: (row) => {
      const { lastname, firstname, middlename, extensionName } = row;
      return `${firstname ?? ''} ${middlename ?? ''} ${lastname ?? ''} ${extensionName ?? ''}`.trim();
    },
    filterFn: (row, columnId, filterValue) => {
      const user = row.original;
      const fullName = `${row.original.firstname ?? ''} ${row.original.middlename ?? ''} ${row.original.lastname ?? ''} ${row.original.extensionName ?? ''}`.toLowerCase().trim();
      return fullName.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorFn: (row) => row.userId.username, // Use accessorFn for nested fields
    id: 'username',
    header: 'Username',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user.userId.username}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.userId.email,
    id: 'email',
    header: 'Email',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' '>
          {user.userId.email}
        </div>
      );
    },
  },
  {
    accessorKey: 'emailVerified',
    accessorFn: (row) => row.userId.emailVerified,
    header: ({ column }) => (
      <EmailVerifiedFilter
        onChange={(emailVerified: string | null) => {
          column.setFilterValue(emailVerified);
        }}
      />
    ),
    cell: ({ row }) => {
      const emailVerified: string | null = row.getValue('emailVerified');
      const formatted = emailVerified ? new Date(emailVerified).toLocaleDateString() : 'Not Verified';
      return <div className='font-medium'>{formatted}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const emailVerified = row.original.userId.emailVerified;
      if (filterValue === 'Not Verified') {
        return !emailVerified;
      } else if (filterValue === 'Verified') {
        return emailVerified !== undefined;
      } else {
        return true;
      }
    },
  },
  {
    accessorFn: (row) => row.userId.role,
    accessorKey: 'role',
    // header: 'Role'
    header: ({ column }) => (
      <RoleFilter
        onChange={(role: string | null) => {
          column.setFilterValue(role);
        }}
      />
    ),
    filterFn: (row, columnId, filterValue) => {
      if (filterValue === null) return true;
      return row.original.userId.role === filterValue;
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

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='bg-white'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user._id)}>Copy user ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
