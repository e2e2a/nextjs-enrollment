'use client';
import { useEffect, useState } from 'react';
import { ColumnDef, flexRender, SortingState, VisibilityState, ColumnFiltersState, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SearchBy from './SearchBy';
import StudentSched from './StudentSched';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData;
  enrollment: any;
  enrollmentSetup: any;
}

export function DataTable<TData, TValue>({ columns, data, enrollment, enrollmentSetup }: DataTableProps<TData, TValue>) {
  const [searchBy, setSearchBy] = useState('Descriptive Title');
  const [enrollmentStudentStatus, setEnrollmentStudentStatus] = useState('');
  useEffect(() => {
    if (!data) {
      return;
    }
    if (enrollment) {
      setEnrollmentStudentStatus(enrollment.enrollStatus);
    }
  }, [data, enrollment]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const validData = Array.isArray(data) ? data : [];
  const table = useReactTable({
    data: validData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className='flex items-center justify-between w-full '>
        <div className='flex items-center  py-4 text-black'>
          <Input
            placeholder={`${searchBy === 'Fullname' ? 'Search by Instructor Name...' : 'Search by Descriptive Title...'}`}
            value={(table.getColumn(searchBy)?.getFilterValue() as string) ?? ''}
            onChange={(event) => {
              table.getColumn(searchBy)?.setFilterValue(event.target.value);
            }}
            className='max-w-sm'
          />
          <SearchBy setSearchBy={setSearchBy} />
        </div>
        {enrollmentSetup.addOrDropSubjects && <StudentSched data={enrollment} />}
      </div>

      {/* Table */}
      <div className='rounded-md border w-full'>
        <Table className=''>
          <TableHeader className='whitespace-pre'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (enrollmentStudentStatus) {
                    if (enrollmentStudentStatus === 'Pending') {
                      if (header.id === 'grade') return;
                    }
                    if (enrollmentStudentStatus === 'Enrolled') {
                      if (header.id === 'status') return;
                    }

                    if (enrollmentStudentStatus === 'Pending' || enrollmentStudentStatus === 'Enrolled') {
                      if (!enrollmentSetup.addOrDropSubjects) {
                        if (header.id === 'request') return;
                        if (header.id === 'requestStatusInDean') return;
                        if (header.id === 'requestStatusInRegistrar') return;
                        if (header.id === 'request status') return;
                      } else {
                        if (header.id === 'status') return;
                      }
                    }
                  }
                  return (
                    <TableHead key={header.id} className='text-center'>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className='text-center '>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow className='whitespace-pre' key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => {
                      if (enrollmentStudentStatus) {
                        if (enrollmentStudentStatus === 'Pending') {
                          if (cell.column.id === 'grade') return;
                        }
                        if (enrollmentStudentStatus === 'Enrolled') {
                          if (cell.column.id === 'status') return;
                        }
                        if (enrollmentStudentStatus === 'Pending' || enrollmentStudentStatus === 'Enrolled') {
                          if (!enrollmentSetup.addOrDropSubjects) {
                            if (cell.column.id === 'request') return;
                            if (cell.column.id === 'requestStatusInDean') return;
                            if (cell.column.id === 'requestStatusInRegistrar') return;
                            if (cell.column.id === 'request status') return;
                          } else {
                            if (cell.column.id === 'status') return;
                          }
                        }
                      }
                      return <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>;
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow className='whitespace-pre'>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-end space-x-2 py-4 w-full'>
        <Button variant='outline' size='sm' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
