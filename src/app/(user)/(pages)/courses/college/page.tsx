'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import LoaderPage from '@/components/shared/LoaderPage';
import { Icons } from '@/components/shared/Icons';
import { useCourseQueryByCategory } from '@/lib/queries/courses/get/category';

const Page = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data: c, isLoading: cLoading, error: cError } = useCourseQueryByCategory('College');

  useEffect(() => {
    if (cError || !c) return;

    if (c) {
      setIsPageLoading(false);
    }
  }, [c, cError]);

  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        c &&
        c.courses && (
          <div className='w-full rounded-md flex flex-col filter-none items-center px-6 py-2 justify-center'>
            <div className='flex w-full flex-col '>
              <h1 className='font-semibold tracking-tight text-3xl lg:text-left text-center w-full'>Available College Courses</h1>
            </div>
            <div className='grid gap-y-8 sm:grid-cols-1 grid-cols-1 gap-4 my-5 w-full place-items-center bg-transparent'>
              {c?.courses?.map((course: any, index: any) => (
                <Card className='w-full group shadow-sm drop-shadow-sm bg-white' key={index}>
                  <CardHeader className='hidden'>
                    <CardTitle className=' capitalize text-[16px]'></CardTitle>
                  </CardHeader>
                  <CardContent className='w-full border space-y-2 p-0 group-hover:bg-gray-300 group-hover:bg-opacity-55 group-hover:border-blue-200'>
                    <div className='w-full flex sm:flex-row flex-col rounded-lg'>
                      <div className='w-full sm:w-56 p-5 '>
                        <Image src={`${course?.imageUrl ? course?.imageUrl : ''}`} className='w-full sm:w-56 border rounded-lg sm:h-48 lg:h-44 bg-white group-hover:border-blue-200' width={200} height={200} priority alt={'nothing to say'} />
                      </div>
                      <div className='flex justify-between flex-1 p-5'>
                        <div className='flex flex-col w-full justify-start'>
                          <Link href={`/curriculums/${course?.courseCode}`} className='flex gap-2 items-center text-sm hover:underline'>
                            <span className='text-blue-700'>View Curriculum</span> <Icons.graduationCap className='h-5 w-5 stroke-orange-300' />
                          </Link>
                          <h1 className=' text-xl tracking-tight capitalize font-semibold'>{course?.name}</h1>
                          <div className='space-y-1.5 flex flex-col px-2'>
                            <p className='text-sm text-muted-foreground text-justify first-letter:uppercase'>&nbsp;&nbsp;&nbsp;&nbsp;{course?.description}</p>
                          </div>
                        </div>
                        <div className='flex w-full justify-end items-start'>
                          <Link href={`/enrollment/college?courses=${course?.courseCode}`} className='flex gap-2 items-center text-sm hover:underline'>
                            <span className='text-blue-700'>Enroll</span> <Icons.arrowRight className='h-4 w-4' />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className='mt-5 hidden'>aa</CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )
      )}
    </>
  );
};

export default Page;
