'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { BellRing, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useUpdateNotificationBySessionIdMutation } from '@/lib/queries/notification/update/session';
import { makeToastError } from '@/lib/toast/makeToast';

interface IProps {
  showNoMoreNotif: boolean;
  showNotifSkeleton: boolean;
  hideButton: boolean;
  showOldNotif: boolean;
  handleShowMoreScroll: () => void;
  handleShowMore: () => void;
  oldNotifications: Array<any>;
  notifications: Array<any>;
}
const Content = ({ showNoMoreNotif, showNotifSkeleton, hideButton, handleShowMoreScroll, handleShowMore, showOldNotif, oldNotifications, notifications, ...props }: IProps) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const mutation = useUpdateNotificationBySessionIdMutation();
  const handleClick = (type: string, notifId?: string) => {
    setIsDisabled(true);

    const data = { type: type, ...(type === 'single' && { notifId }) };

    mutation.mutate(data, {
      onSuccess: (res: any) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            return;
          default:
            makeToastError(res.error);
            return;
        }
      },
      onSettled: () => {
        setIsDisabled(false);
      },
    });
  };
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const content = contentRef.current;
    if (!content) return;

    const isAtBottom = content.scrollTop + content.clientHeight >= content.scrollHeight - 10;

    if (isAtBottom && !showNoMoreNotif) {
      handleShowMoreScroll();
    }
  };

  useEffect(() => {
    const content = contentRef.current;

    if (content) {
      // Add scroll event listener
      content.addEventListener('scroll', handleScroll);
    }

    // Cleanup event listener on unmount
    return () => {
      if (content) {
        content.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);
  return (
    <Card className={cn(' shadow-none border-none w-[308px] sm:w-[338px] pb-3 mb-3 border-0 p-0')} {...props}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          <button type='button' onClick={() => handleClick('mark all as read')} disabled={isDisabled}>
            <Badge className='bg-neutral-100 hover:bg-blue-500 hover:text-white cursor-pointer'>Mark all as read</Badge>
          </button>
        </CardDescription>
      </CardHeader>
      <CardContent ref={contentRef} className={`grid gap-4 px-3 border-none max-h-[320px] overflow-y-auto overflow-x-hidden`}>
        <div className='mb-5'>
          {notifications.length > 0 && <div className='  font-semibold text-sm font-sans mb-4'>New Notification</div>}
          {notifications.map((notification, index) => (
            <div key={index} className='mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0'>
              <span className='flex h-2 w-2 translate-y-1 rounded-full bg-sky-500' />
              <button type='submit' onClick={() => handleClick('single', notification._id)}>
                <div className='flex flex-col space-y-1  w-[250px] sm:w-[250px] '>
                  <Link href={notification.link} className='text-sm font-medium leading-none text-justify'>
                    {notification.title}
                  </Link>
                  <Link href={notification.link} className='text-sm text-muted-foreground text-justify'>
                    - {notification.from?.type ? notification.from.type : `${notification.from.firstname} ${notification.from.lastname}`}
                  </Link>
                </div>
              </button>
            </div>
          ))}

          {oldNotifications.length > 0 && <div className='  font-semibold text-sm font-sans mb-4'>Old Notification</div>}
          {oldNotifications.length > 0 &&
            oldNotifications.map((notification, index) => (
              <div key={index} className='mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0'>
                <span className='flex h-2 w-2 translate-y-1 rounded-full bg-none' />
                <div className='flex flex-col space-y-1 w-[250px] sm:w-[250px] '>
                  <Link href={notification.link} className='text-sm font-medium leading-none text-justify'>
                    {notification.title}
                  </Link>
                  <Link href={notification.link} className='text-sm text-muted-foreground text-justify'>
                    - {notification.from?.type ? notification.from.type : `${notification.from.firstname} ${notification.from.lastname}`}
                  </Link>
                </div>
              </div>
            ))}
          {showNotifSkeleton && (
            <div className='flex items-center space-x-4 px-5'>
              {/* <Skeleton className='h-12 w-12 rounded-full' /> */}
              <div className='space-y-2'>
                <Skeleton className='h-4 w-[250px]' />
                <Skeleton className='h-4 w-[150px]' />
              </div>
            </div>
          )}
          {showNoMoreNotif && (
            <div className='mb-4 flex justify-center pb-4 last:mb-0 last:pb-0'>
              <span className='text-sm text-muted-foreground text-justify'>No more notification found.</span>
            </div>
          )}
          {!hideButton && (
            <div className='flex justify-center items-center'>
              <Button type='submit' variant={'ghost'} className='p-0 m-0 text-sm hover:text-blue-500' onClick={() => handleShowMore()}>
                Show Old Notifications
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      {/* <CardFooter className='py-1 m-0 w-full flex items-center justify-center'>
      {!hideButton && (
        <Button variant={'ghost'} className='p-0 m-0 text-sm hover:text-blue-500' onClick={handleShowMore}>
          Show Old Notifications
        </Button>
      )} 
       <Link href={'/'} className=' p-0 w-auto text-sm hover:underline text-blue-600 tracking-wide'>
          See all notifications
      </Link> 
    </CardFooter> */}
    </Card>
  );
};

export default Content;
