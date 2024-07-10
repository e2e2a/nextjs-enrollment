'use client'

import { ColumnDef } from '@tanstack/react-table'

import { MoreHorizontal, ArrowUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import RoleFilter from './RoleFilter'
import EmailVerifiedFilter from './EmailVerifiedFilter'

interface User {
  id: string;
  image: string | null;
  firstname: string;
  lastname: string;
  username: string | null;
  bio: string | null;
  email: string | null;
  emailVerified: Date | null;
  role: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id}>
          {user.lastname}, {user.firstname} 
        </div>
      );
    },
    accessorFn: row => `${row.lastname}, ${row.firstname}`,
    // filterFn: (row, columnId, filterValue) => {
    //   const fullName = `${row.original.lastname}, ${row.original.firstname}`.toLowerCase();
    //   return fullName.includes(filterValue.toLowerCase());
    // },
  },
  {
    accessorKey: 'username',
    header: 'Username'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'emailVerified',
    // header: 'Email Verified',
    header: ({ column }) => (
      <EmailVerifiedFilter
        onChange={(emailVerified: string | null) => {
          // Your custom logic to filter based on role
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
      // Custom filter function for role column
      // if (filterValue === null) return true;
      switch (filterValue) {
        case 'Not Verified':
          return row.original.emailVerified === null;
        case 'Verified':
          return row.original.emailVerified !== null;
        default:
          return true; // Default to showing all rows if no filter value is provided
      }
      // return row.original.emailVerified !== null;
    },
  },
  {
    accessorKey: 'role',
    // header: 'Role'
    header: ({ column }) => (
      <RoleFilter
        onChange={(role: string | null) => {
          // Your custom logic to filter based on role
          column.setFilterValue(role);
        }}
      />
    ),
    filterFn: (row, columnId, filterValue) => {
      // Custom filter function for role column
      if (filterValue === null) return true;
      return row.original.role === filterValue;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'CreatedAt',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      const formatted = date.toLocaleDateString()
      return <div className='font-medium'>{formatted}</div>
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]