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
    accessorFn: (row) => row.userId.username,
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
    id: 'role',
    header: 'Role',
    cell: ({ cell, row }) => {
      const user = row.original;
      return (
        <div key={cell.id} className=' uppercase'>
          {user.userId.role}
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
];
