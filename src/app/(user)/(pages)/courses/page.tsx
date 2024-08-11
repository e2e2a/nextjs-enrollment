import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { coursesData } from '@/constant/test/courses';

const page = () => {
  return (
    <div className='w-full rounded-md flex flex-col gap-4 bg-white items-center px-4 py-8 justify-center'>
      <div className='flex w-full flex-col'>
        <h1 className='font-bold font-poppins text-3xl lg:text-left text-center w-full'>Courses</h1>
        <p className='text-sm text-muted-foreground text-justify'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem officiis fugiat culpa temporibus commodi blanditiis quo cum. Aperiam, delectus. Sequi cumque labore quasi placeat libero?</p>
      </div>
      <div className='grid lg:grid-cols-2 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 my-5 w-full place-items-center bg-white'>
        {coursesData.map((course, index) => (
          <Card className='w-full group ' key={index}>
            <div className='group-hover:bg-slate-100 '>
              <CardHeader>
                <CardTitle className=''>{course.name} - ({course.title})</CardTitle>
                <Image src={'/images/login.jpg'} className='w-full rounded-sm' width={95} height={95} priority alt='images' />
              </CardHeader>
              <CardContent className='w-full space-y-2'>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground text-justify'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos quibusdam deserunt nulla? Iure, earum quod!</p>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex w-full justify-end items-center">
                <Link href={`/enrollment?courses=${course.title}`} className=''>
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
