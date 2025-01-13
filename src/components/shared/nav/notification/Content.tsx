'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { BellRing, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface IProps {
  // notifications: Array<{ title: string; description: string }>;
  hideButton: boolean;
  handleShowMore: () => void;
  notifications: Array<any>;
}
const Content = ({ hideButton, handleShowMore, notifications, ...props }: IProps) => {
  return (
    <Card className={cn(' w-[308px] sm:w-[338px] border-0 p-0')} {...props}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You&apos;re notification.</CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4 pb-0 px-3 max-h-72 overflow-y-auto'>
        <div className='mb-12'>
          {notifications.map((notification, index) => (
            <div key={index} className='mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0'>
              <span className='flex h-2 w-2 translate-y-1 rounded-full bg-sky-500' />
              <div className='flex flex-col space-y-1  w-[250px] sm:w-[250px] '>
                <Link href={notification.link} className='text-sm font-medium leading-none text-justify'>
                  {notification.title}
                </Link>
                <Link href={notification.link} className='text-sm text-muted-foreground text-justify'>
                  - {notification.from?.type ? notification.from.type : `${notification.from.firstname} ${notification.from.lastname}`}
                </Link>
              </div>
            </div>
          ))}
          {hideButton && (
            <div className='mb-4 flex justify-center pb-4 last:mb-0 last:pb-0'>
              <span className='text-sm text-muted-foreground text-justify'>No more notification found.</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className='py-1 m-0 w-full flex items-center justify-center'>
        {!hideButton && (
          <Button variant={'ghost'} className='p-0 m-0 text-sm hover:text-blue-500' onClick={handleShowMore}>
            Show More
          </Button>
        )}
        {/* <Link href={'/'} className=' p-0 w-auto text-sm hover:underline text-blue-600 tracking-wide'>
           See all notifications
        </Link> */}
      </CardFooter>
    </Card>
  );
};

export default Content;
