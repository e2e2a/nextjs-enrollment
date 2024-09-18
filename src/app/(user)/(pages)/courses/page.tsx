'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCourseQuery } from '@/lib/queries';
import LoaderPage from '@/components/shared/LoaderPage';

const Page = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data: c, isLoading: cLoading, error: cError } = useCourseQuery();
  useEffect(() => {
    if (cLoading || !c) {
      return;
    }
    if (cError) return; //setError(true);

    if (c) {
      setIsPageLoading(false);
    }
  }, [c, cLoading, cError]);

  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        c &&
        c.courses && (
          <div className='w-full rounded-md flex flex-col gap-4 bg-neutral-50 filter-none items-center px-6 py-8 justify-center'>
            <div className='flex w-full flex-col'>
              <h1 className='font-bold font-poppins text-3xl lg:text-left text-center w-full'>Courses</h1>
              <p className='text-sm text-muted-foreground text-justify'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem officiis fugiat culpa temporibus commodi blanditiis quo cum. Aperiam, delectus. Sequi cumque labore quasi placeat libero?</p>
            </div>
            {/* <div className='grid lg:grid-cols-2 shadow-none drop-shadow-none xl:grid-cols-3 gap-y-8 sm:grid-cols-2 grid-cols-1 gap-4 my-5 w-full place-items-center bg-transparent'> */}
            <div className='grid lg:grid-cols-2 xl:grid-cols-3 gap-y-8 sm:grid-cols-2 grid-cols-1 gap-4 my-5 w-full place-items-center bg-transparent'>
              {c?.courses?.map((course, index) => (
                <Card className='w-full group shadow-sm drop-shadow-sm bg-white ' key={index}>
                  <div className='group-hover:bg-slate-200'>
                    <CardHeader>
                      <CardTitle className=' capitalize text-[16px]'>{course.name}</CardTitle>
                    </CardHeader>
                    <CardContent className='w-full space-y-2 p-0'>
                      <div className='w-full border block shadow-sm mb-2 bg-white rounded-lg'>
                        <Image src={`${course.imageUrl ? course.imageUrl : ''}`} className='w-full rounded-lg sm:h-56 lg:h-64' width={200} height={200} priority alt={course.name} />
                      </div>
                      <div className='space-y-1.5 flex flex-col px-2'>
                        <h1 className='font-medium text-[15px]'>Description</h1>
                        <p className='text-sm text-muted-foreground text-justify first-letter:uppercase'> &nbsp;&nbsp;&nbsp;&nbsp; {course.description} asdasd asdasd</p>
                      </div>
                    </CardContent>
                    <CardFooter className='mt-5'>
                      <div className='flex w-full justify-end items-center'>
                        <Link href={`/enrollment?courses=${course.courseCode}`} className=''>
                          <Button size={'sm'} className='bg-blue-500 hover:bg-blue-700 text-white  text-center font-bold tracking-wide' type='button'>
                            Enroll me now!
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </div>
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
