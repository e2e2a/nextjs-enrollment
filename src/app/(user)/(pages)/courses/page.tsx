'use client';
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCourseQuery } from '@/lib/queries';

const page = () => {
  const { data: res, isLoading: isCoursesLoading, error: isCoursesError } = useCourseQuery();
  useEffect(() => {
    if (isCoursesError || !res || !res.courses) {
      return;
    }
    if (res) console.log('courses logs:', res.courses);
  }, [res, isCoursesLoading, isCoursesError]);
  return (
    <div className='w-full rounded-md flex flex-col gap-4 bg-white items-center px-4 py-8 justify-center'>
      <div className='flex w-full flex-col'>
        <h1 className='font-bold font-poppins text-3xl lg:text-left text-center w-full'>Courses</h1>
        <p className='text-sm text-muted-foreground text-justify'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem officiis fugiat culpa temporibus commodi blanditiis quo cum. Aperiam, delectus. Sequi cumque labore quasi placeat libero?</p>
      </div>
      <div className='grid lg:grid-cols-2 xl:grid-cols-3 gap-y-8 sm:grid-cols-2 grid-cols-1 gap-4 my-5 w-full place-items-center bg-white'>
        {res?.courses?.map((course, index) => (
          <Card className='w-full group' key={index}>
            <div className='group-hover:bg-slate-100 '>
              <CardHeader>
                <CardTitle className=''>
                  {course.name} - ({course.courseCode})
                </CardTitle>
              </CardHeader>
              <CardContent className='w-full space-y-2'>
                <div className='w-full border block shadow-sm mb-2 bg-white rounded-md'>
                  <Image src={`${course.imageUrl}`} className='w-full sm:h-56 lg:h-64' width={200} height={200} priority alt={course.name} />
                </div>
                <div className='space-y-1.5 flex flex-col'>
                  <h1 className='font-medium text-[15px]'>Description</h1>
                  <p className='text-sm text-muted-foreground text-justify first-letter:uppercase'> &nbsp;&nbsp;&nbsp;&nbsp; {course.description} asdasd asdasd</p>
                </div>
              </CardContent>
              <CardFooter>
                <div className='flex w-full justify-end items-center'>
                  <Link href={`/enrollment?courses=${course.courseCode}`} className=''>
                    <Button className='bg-yellow-300  text-center font-bold tracking-wide' type='button'>
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
  );
};

export default page;
