"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { BellRing, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type CardProps = React.ComponentProps<typeof Card>;
interface DropdownContentProps extends CardProps {
  // notifications: Array<{ title: string; description: string }>;
  notifications: Array<any>;
}
const DropdownContent = ({ className,notifications= [], ...props }: DropdownContentProps) => {
  const [visibleCount, setVisibleCount] = useState(3);
  
  const handleShowMore = () => {
    setVisibleCount((prevCount) => {
      const newCount = prevCount + 3;
      // setCurrentNotifications(notifications.slice(0, newCount));
      return newCount;
    });
  };
  return (
    <Card className={cn(' w-[308px] sm:w-[338px] border-0 p-0', className)} {...props}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4 pb-0 px-3 max-h-72 overflow-y-auto'>
        {/* <div className=' flex items-center space-x-4 rounded-md border p-4'>
          <BellRing />
          <div className='flex-1 space-y-1'>
            <p className='text-sm font-medium leading-none'>Push Notifications</p>
            <p className='text-sm text-muted-foreground'>Send notifications to device.</p>
          </div>
          <Switch />
        </div> */}
        {/* <div>
          {notifications.map((notification, index) => (
            <div key={index} className='mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0'>
              <span className='flex h-2 w-2 translate-y-1 rounded-full bg-sky-500' />
              <div className='space-y-1'>
                <p className='text-sm font-medium leading-none'>{notification.title}</p>
                <p className='text-sm text-muted-foreground'>{notification.description}</p>
              </div>
            </div>
          ))}
        </div>
        <Button variant={'ghost'}>Show More</Button> */}
         <div>
          {notifications.slice(0, visibleCount).map((notification, index) => (
            <div key={index} className='mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0'>
              <span className='flex h-2 w-2 translate-y-1 rounded-full bg-sky-500' />
              <div className='space-y-1'>
                <p className='text-sm font-medium leading-none'>{notification.title}</p>
                <p className='text-sm text-muted-foreground'>{notification.description}</p>
              </div>
            </div>
          ))}
        </div>
        {visibleCount < notifications.length && (
          <Button variant={'ghost'} className='p-0 m-0 text-sm hover:bg-slate-300' onClick={handleShowMore}>
            Show More
          </Button>
        )}
        
      </CardContent>
      <CardFooter className='py-1 m-0 w-full flex items-center justify-center'>
      <Link href={'/'} className=' p-0 w-auto text-sm hover:underline text-blue-600 tracking-wide'>
           See all notifications
        </Link>
      </CardFooter>
      
      
    </Card>
  );
};

export default DropdownContent;
