'use client';
import React, { useEffect, useState } from 'react';
import StudentsByYear from './StudentsByYear';
import { Icons } from '@/components/shared/Icons';
import TotalsByYear from './TotalsByYear';

interface IProps {
  enrollments: any;
  courses: any;
  blockTypes: any;
}

const StudentsByCourses = ({ enrollments, courses, blockTypes }: IProps) => {
  const years = [{ year: '1st year' }, { year: '2nd year' }, { year: '3rd year' }, { year: '4th year' }, { year: '5th year' }];
  return (
    <>
      {courses.length > 0 &&
        courses.map((c: any, i: any) => {
          const enrolledCourse = enrollments.filter((e: any) => e?.courseId?._id === c?._id);
          const filteredBlocks = blockTypes.filter((b: any) => b?.courseId?._id === c?._id);
          return (
            <div className='border-2 rounded-lg mt-10 p-3' key={i}>
              <h1 className='font-semibold capitalize text-lg w-full text-center mb-5'>{c.name}</h1>
              <div className='grid gap-2 grid-cols-1 md:grid-cols-2 mb-5'>
                <div className='group flex flex-row gap-4 ml-0 md:ml-28'>
                  <div className=''>
                    <span className='font-semibold capitalized'>OverAll:</span> {enrollments.length}
                  </div>
                  <div className='hidden group-hover:flex space-x-2'>
                    <Icons.download className='h-5 w-5 cursor-pointer' />
                    <Icons.download className='h-5 w-5 cursor-pointer' />
                    <Icons.download className='h-5 w-5 cursor-pointer' />
                    <Icons.download className='h-5 w-5 cursor-pointer' />
                  </div>
                </div>
                {years.map((y: any, i: any) => {
                  const enrollment = enrollments.filter((e: any) => e.studentYear === y.year);
                  return (
                    <div className='group flex flex-row gap-4 ml-0 md:ml-28' key={i}>
                      <TotalsByYear enrollments={enrollment} year={y.year} />
                    </div>
                  );
                })}
              </div>
              <StudentsByYear enrollments={enrolledCourse} blockTypes={filteredBlocks} />
            </div>
          );
        })}
    </>
  );
};

export default StudentsByCourses;
