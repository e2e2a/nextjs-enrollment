'use client';
import { Icons } from '@/components/shared/Icons';
import React from 'react';

interface IProps {
  enrollments: any;
  year: any;
}

const TotalsByYear = ({ enrollments, year }: IProps) => {
  return (
    <div>
      <div className=''>
        <span className='font-semibold capitalized'>Total {year}:</span> {enrollments.length}
      </div>
      {/* <div className='hidden group-hover:flex space-x-2'>
        <Icons.download className='h-5 w-5 cursor-pointer' />
        <Icons.download className='h-5 w-5 cursor-pointer' />
        <Icons.download className='h-5 w-5 cursor-pointer' />
        <Icons.download className='h-5 w-5 cursor-pointer' />
      </div> */}
    </div>
  );
};

export default TotalsByYear;
