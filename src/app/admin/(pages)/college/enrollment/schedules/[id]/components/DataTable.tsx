'use client';
import { useCallback, useEffect, useState } from 'react';
import { ColumnDef, flexRender, SortingState, VisibilityState, ColumnFiltersState, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SearchBy from './SearchBy';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData;
  enrollmentSetup: any;
  enrollment: any;
}

export function DataTable<TData, TValue>({ columns, data, enrollmentSetup, enrollment }: DataTableProps<TData, TValue>) {
  const [searchBy, setSearchBy] = useState('Fullname');
  useEffect(() => {
    if (!data) {
      return;
    }
  }, [data]);
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
      {/* Filters */}
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

        {/* Column visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='bg-neutral-50'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem key={column.id} className='capitalize' checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className='rounded-md border w-full '>
        <Table className=''>
          <TableHeader className='whitespace-pre'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (enrollment.enrollStatus !== 'Enrolled' && enrollment.enrollStatus !== 'Temporary Enrolled') {
                    if (header.id === 'prelim') return;
                    if (header.id === 'midterm') return;
                    if (header.id === 'semi-final') return;
                    if (header.id === 'final') return;
                    if (header.id === 'averageTotal') return;
                  }
                  if (enrollment.step >= 4) {
                    if (header.id === 'actions') return;
                  } else {
                    if (header.id === 'requesting') return;
                    if (header.id === 'requestStatusInDean') return;
                    if (header.id === 'requestStatusInRegistrar') return;
                    if (header.id === 'options') return;
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
              table.getRowModel().rows.map((row) => (
                <TableRow className='whitespace-pre' key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => {
                    if (enrollment.enrollStatus !== 'Enrolled' && enrollment.enrollStatus !== 'Temporary Enrolled') {
                      if (cell.column.id === 'prelim') return;
                      if (cell.column.id === 'midterm') return;
                      if (cell.column.id === 'semi-final') return;
                      if (cell.column.id === 'final') return;
                      if (cell.column.id === 'averageTotal') return;
                    }
                    if (enrollment.step >= 4) {
                      if (cell.column.id === 'actions') return;
                    } else {
                      if (cell.column.id === 'requesting') return;
                      if (cell.column.id === 'requestStatusInDean') return;
                      if (cell.column.id === 'requestStatusInRegistrar') return;
                      if (cell.column.id === 'options') return;
                    }
                    return <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>;
                  })}
                </TableRow>
              ))
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
