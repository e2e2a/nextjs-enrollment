'use client';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import LoaderPage from '@/components/shared/LoaderPage';
import { Icons } from '@/components/shared/Icons';
import Link from 'next/link';

interface IProps {
  data: any;
}
const CategoryTable = ({ data }: IProps) => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [categoryCollege, setCategoryCollege] = useState([]);

  useEffect(() => {
    if (data === undefined || data === null) return setIsPageLoading(true);
    if (data && data.length > 0) {
      const college = data.filter((e: any) => e.category === 'College');
      setCategoryCollege(college);
      return setIsPageLoading(false);
    } else {
      return setIsPageLoading(false);
    }
  }, [data]);

  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <div className='overflow-auto rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-center'>Category</TableHead>
                <TableHead className='text-center'>Records</TableHead>
                <TableHead className='text-center'>Links</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                categoryCollege &&
                categoryCollege.length > 0 && (
                  <TableRow>
                    <TableCell className='text-center'>College</TableCell>
                    <TableCell className='text-center'>{categoryCollege.length}</TableCell>
                    <TableCell className=''>
                      <div className='flex justify-center'>
                        <Link href={`/record/college`} className='flex gap-2 bg-blue-600 px-3 py-1.5 rounded-md border items-center text-sm hover:bg-blue-700 hover:text-neutral-50'>
                          <Icons.eye className='h-4 w-4 text-white' /> <span className='text-white'>View Records</span>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className='text-center py-4'>
                    No Records Found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default CategoryTable;
