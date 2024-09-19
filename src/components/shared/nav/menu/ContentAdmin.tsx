'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { BellRing, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { SidebarNavItem } from '@/types';
import { Icons } from '../../Icons';
import NavbarFooter from '../NavbarFooter';
import CollapsibleItem from '@/app/admin/components/CollapsibleItem';

type CardProps = React.ComponentProps<typeof Card>;
interface DropdownContentProps extends CardProps {
  // notifications: Array<{ title: string; description: string }>;
  items: SidebarNavItem[];
}
const ContentAdmin = ({ className, items, ...props }: DropdownContentProps) => {
  const [visibleCount, setVisibleCount] = useState(3);

  const handleShowMore = () => {
    setVisibleCount((prevCount) => {
      const newCount = prevCount + 3;
      // setCurrentNotifications(notifications.slice(0, newCount));
      return newCount;
    });
  };
  return (
    <Card className={cn('w-[308px] sm:w-[338px] border-0 p-0', className)} {...props}>
      <CardHeader>
        <CardTitle>Menu</CardTitle>
        <CardDescription>Discover with our pages</CardDescription>
      </CardHeader>
      <CardContent className='grid gap-1 pb-0 px-3 max-h-72 overflow-hidden overflow-y-auto custom-scrollbar'>
        {items.map((item, index) => {
          const Icon = Icons[item.icon || 'arrowRight'];
          return item.href ? (
            <Link key={index} href={item.disabled ? '/' : item.href} className='flex w-full select-none'>
              <Button type='button' className='group select-none border-0 w-full hover:bg-slate-300 px-5 py-6 flex space-x-2 items-center gap-x-1 justify-start pl-3'>
                <Icon className='h-7 w-7 group-hover:stroke-blue-500' />
                <span className='font-semibold text-sm tracking-tight'>{item.title}</span>
              </Button>
            </Link>
          ) : (
            <div className='w-full' key={index}>
              <CollapsibleItem item={item} Icon={Icon} />
            </div>
          );
        })}
      </CardContent>
      <NavbarFooter classname={'py-2 px-3 text-[14px] justify-start w-full'} />
    </Card>
  );
};

export default ContentAdmin;
