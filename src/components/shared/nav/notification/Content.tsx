'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { BellRing, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

interface IProps {
  // notifications: Array<{ title: string; description: string }>;
  hideButton: boolean;
  handleShowMore: () => void;
  notifications: Array<any>;
}
const Content = ({ hideButton, handleShowMore, notifications, ...props }: IProps) => {
  const updateViewportDimensions = () => {
    const root = document.documentElement;
    root.style.setProperty('--viewport-width', `${window.innerWidth}px`);
    root.style.setProperty('--viewport-height', `${window.innerHeight}px`);
  };

  useEffect(() => {
    // Update dimensions on component mount
    updateViewportDimensions();

    // Add event listener for window resize
    window.addEventListener('resize', updateViewportDimensions);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('resize', updateViewportDimensions);
    };
  }, []);
  return (
    <Card className={cn(' w-[308px] sm:w-[338px] pb-3 mb-3 border-0 p-0')} {...props}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You&apos;re notification.</CardDescription>
      </CardHeader>
      <CardContent
        className={`grid gap-4 px-3 max-h-full overflow-y-auto overflow-x-hidden`}
        style={{
          maxHeight: `calc(var(--viewport-height) - 170px)`, // Inline style for dynamic max-height
        }}
      >
        <div className='mb-5'>
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
          {!hideButton && (
            <div className='flex items-center space-x-4'>
              <Skeleton className='h-12 w-12 rounded-full' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-[250px]' />
                <Skeleton className='h-4 w-[200px]' />
              </div>
            </div>
          )}
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
