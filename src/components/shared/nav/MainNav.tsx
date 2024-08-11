'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname, useSelectedLayoutSegment } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Icons } from '../Icons';
import { MainNavItem } from '@/types';
import { UserAccountNav } from './UserAvatar/UserAccountNav';
import { Button } from '@/components/ui/button';
import { Notification } from './notification/Notification';
import Menu from './menu/Menu';
interface MainNavProps {
  session?: any;
  items?: MainNavItem[];
  children?: React.ReactNode;
  profile?: any
}

export function MainNav({ session, items, children, profile }: MainNavProps) {
  const segment = usePathname();
  
  return (
    <div className='md:px-[1.2%] px-1 flex h-14 pt-1 items-center justify-between bg-white'>
      <div className='flex gap-0 md:gap-10'>
        <Link href='/' className='flex items-center space-x-2 md:flex ml-1.5 md:ml-0'>
          <Icons.logo className='h-8 w-8' />
          <span className='hidden font-bold sm:inline-block'>{/* {siteConfig.name} */}e2e2a</span>
        </Link>
        
      </div>
      {session?.profileVerified && items?.length ? (
        <nav className='hidden gap-1 md:flex'>
          {items?.map((item, index) => {
            const Icon = Icons[item.icon!];
            return (
              <TooltipProvider key={index} delayDuration={10}>
                <Tooltip>
                  <TooltipTrigger className='' asChild>
                    <Link href={item.disabled ? '#' : item.href} className={cn('flex flex-col items-center text-lg font-medium sm:text-sm w-full')}>
                      <Button className='group border border-white hover:bg-slate-200 hover:bg-opacity-45 px-10 py-6 flex items-center justify-center'>
                        <Icon className={cn('h-6 w-6 lg:h-6 lg:w-6 ', item.href === segment ? ' stroke-blue-500 scale-[105%]' : 'group-hover:scale-[115%] transition-transform duration-200')} />
                      </Button>
                      <span className={cn(item.href === segment ? 'text-foreground border-blue-500 border-b-4 w-full ' : 'text-foreground/60', item.disabled && 'cursor-not-allowed opacity-80')}></span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent className='bg-white py-1 px-2'>
                    <p className='text-sm'>{item.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </nav>
      ) : null}
      <div className='flex items-center gap-2'>
        <Menu classname={"lg:hidden flex"}/>
        <Notification />
        <UserAccountNav session={session} profile={profile}/>
      </div>
    </div>
  );
}
