'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmailVerifiedFilter from './EmailVerifiedFilter';
import ActionsCell from './ActionsCell';

export const columns: ColumnDef<any>[] = [
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
      const name =
        user?.lastname && user?.firstname
          ? `${user?.lastname ? user?.lastname + ',' : ''} ${user?.firstname ?? ''} ${user?.middlename ?? ''}${user?.extensionName ? ', ' + user?.extensionName + '.' : ''}`
              .replace(/\s+,/g, ',') // Fix spaces before commas
              .replace(/,(\S)/g, ', $1') // Ensure proper comma spacing
              .replace(/\s+/g, ' ') // Remove extra spaces
              .trim()
          : 'Unknown';

      return (
        <div key={cell.id} className='capitalize'>
          {name}
        </div>
      );
    },

    accessorFn: (row) => {
      const { lastname, firstname, middlename, extensionName } = row;
      return `${lastname ? lastname + ',' : ''} ${firstname ?? ''} ${middlename ?? ''}${extensionName ? ', ' + extensionName + '.' : ''}`.replace(/\s+,/g, ',').replace(/,(\S)/g, ', $1').replace(/\s+/g, ' ').trim();
    },

    filterFn: (row, columnId, filterValue) => {
      const user = row.original;
      const fullName = `${user?.lastname ? user?.lastname + ',' : ''} ${user?.firstname ?? ''} ${user?.middlename ?? ''}${user?.extensionName ? ', ' + user?.extensionName + '.' : ''}`
        .replace(/\s+,/g, ',')
        .replace(/,(\S)/g, ', $1')
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .trim();

      return fullName.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorFn: (row) => row.userId?.username,
    id: 'username',
    header: 'Username',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=''>
          {user?.userId?.username}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.userId?.email,
    id: 'email',
    header: 'Email',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' '>
          {user?.userId?.email}
        </div>
      );
    },
  },
  {
    accessorKey: 'emailVerified',
    accessorFn: (row) => row.userId?.emailVerified,
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
      const emailVerified = row.original.userId?.emailVerified;
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
    accessorFn: (row) => row.userId?.role,
    id: 'role',
    header: 'Role',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.userId?.role}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.userId?.revoke,
    id: 'Revoke',
    header: 'Revoke',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user?.userId?.revoke ? 'TRUE' : 'FALSE'}
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
