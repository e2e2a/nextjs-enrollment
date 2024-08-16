// @ts-nocheck
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

interface Enrollment {
    id: string;
    userId: any
    courseId: any;
    studentYear: string;
    studentSemester: string;
    step: any
    createdAt: Date;
    updatedAt: Date;
  }
export const columns: ColumnDef<Enrollment>[] = [
    {
        accessorKey: 'profileId.firstname',
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
          console.log('test user', user)
          return (
            <div key={cell.id}>
              {user.profileId.lastname}, {user.profileId.firstname} 
            </div>
          );
        },
        accessorFn: row => `${row.userId.lastname}, ${row.userId.firstname}`,
        // filterFn: (row, columnId, filterValue) => {
        //   const fullName = `${row.original.lastname}, ${row.original.firstname}`.toLowerCase();
        //   return fullName.includes(filterValue.toLowerCase());
        // },
      },
  {
    accessorFn: row => `${row.userId.lastname}, ${row.userId.firstname}`, // Use accessorFn for nested fields
    id: 'fullName',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Name
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ cell }) => cell.getValue(), // Directly use cell value
    // filterFn: (row, columnId, filterValue) => {
    //   const fullName = `${row.original.lastname}, ${row.original.firstname}`.toLowerCase();
    //   return fullName.includes(filterValue.toLowerCase());
    // },
  },
  {
    accessorFn: row => row.courseId.courseCode, // Use accessorFn for nested fields
    id: 'courseCode',
    header: 'Course',
    cell: ({ cell }) => cell.getValue(), // Directly use cell value
  },
  {
    accessorKey: 'studentYear',
    header: 'Student Year'
  },
  {
    accessorKey: 'studentSemester',
    header: 'Student Semester'
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
      const date = new Date(row.getValue('createdAt'))
      const formatted = date.toLocaleDateString()
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
            <Button variant='' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='bg-white'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user._id)}
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