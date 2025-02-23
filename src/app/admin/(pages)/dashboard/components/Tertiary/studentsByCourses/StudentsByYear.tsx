'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

interface IProps {
  enrollments: any;
  blockTypes: any;
}

const StudentsByYear = ({ enrollments, blockTypes }: IProps) => {
  const years = [{ year: '1st year' }, { year: '2nd year' }, { year: '3rd year' }, { year: '4th year' }, { year: '5th year' }];

  return (
    <div className=''>
      {years.map((y: any, i: any) => {
        const filteredBlocks = blockTypes.filter((b: any) => b.year === y.year);
        return (
          <div className='' key={i}>
            <h1 className='font-semibold capitalize text-lg w-full text-center p-5'>{y.year}</h1>
            <div className={`grid grid-cols-1 md:grid-cols-${filteredBlocks.length} gap-4`}>
              {filteredBlocks.length > 0 ? (
                filteredBlocks.map((b: any, i: any) => {
                  const filteredEnrolment = enrollments.filter((e: any) => e.studentYear === y.year && e?.blockTypeId?._id === b?._id);
                  return (
                    <Card key={i}>
                      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium uppercase'>Block {b.section}</CardTitle>
                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
                          <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className='text-2xl font-bold'>{filteredEnrolment.length}</div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className=' text-muted-foreground text-center'>There is no blocks to find in {y.year}.</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StudentsByYear;
