'use client';
import * as React from 'react';
import Link from 'next/link';
import { MainNavItem } from '@/types';
import { cn } from '@/lib/utils';
import { Icons } from '../Icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
interface MobileNavProps {
  items: MainNavItem[];
  session: any;
  // children?: React.ReactNode
}

export function MobileNav({ items, session }: MobileNavProps) {
  const segment = usePathname();
  return (
    // <div
    //   className={cn(
    //     "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden"
    //   )}
    // >
    //   <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
    //     <Link href="/" className="flex items-center space-x-2">
    //       <Icons.logo />
    //       <span className="font-bold">{siteConfig.name}</span>
    //     </Link>
    //     <nav className="grid grid-flow-row auto-rows-max text-sm">
    //       {items.map((item, index) => (
    //         <Link
    //           key={index}
    //           href={item.disabled ? "#" : item.href}
    //           className={cn(
    //             "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
    //             item.disabled && "cursor-not-allowed opacity-60"
    //           )}
    //         >
    //           {item.title}
    //         </Link>
    //       ))}
    //     </nav>
    //     {children}
    //   </div>
    // </div>
    <div className=' flex h-14 w-full items-center justify-between bg-white md:hidden'>
      {session?.profileVerified && items?.length ? (
        <nav className='w-full gap-1 flex '>
          {items?.map((item, index) => {
            const Icon = Icons[item.icon!];
            return (
              <TooltipProvider key={index} delayDuration={10}>
                <Tooltip>
                  <TooltipTrigger className='' asChild>
                    <Link href={item.disabled ? '#' : item.href} className={cn('flex flex-col items-center text-lg font-medium sm:text-sm w-full')}>
                      <Button className='group border border-white hover:bg-slate-200 hover:bg-opacity-45 flex items-center justify-center w-full'>
                        <Icon className={cn('h-6 w-6 lg:h-8 lg:w-8 ', item.href === segment ? ' stroke-blue-500 scale-[105%]' : '')} />
                      </Button>
                      <span className={cn(item.href === segment ? 'text-foreground border-blue-500 border-b-4 w-full ' : 'text-foreground/60')}></span>
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
    </div>
  );
}
