'use client';
import { useCallback, useEffect, useState } from 'react';
import { ColumnDef, flexRender, SortingState, VisibilityState, ColumnFiltersState, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import OptionsCell from './OptionsCell';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  studentId: string;
}

export function DataTable<TData, TValue>({ columns, data, studentId }: DataTableProps<TData, TValue>) {
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
            placeholder='Search by name...'
            value={(table.getColumn('Course Name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => {
              table.getColumn('Course Name')?.setFilterValue(event.target.value);
            }}
            className='max-w-sm'
          />
        </div>

        <OptionsCell studentId={studentId} />
      </div>

      {/* Table */}
      <div className='rounded-md border w-full '>
        <Table className=''>
          <TableHeader className='whitespace-pre'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
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
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
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
