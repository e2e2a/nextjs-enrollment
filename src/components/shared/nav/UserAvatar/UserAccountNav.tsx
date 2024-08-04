'use client';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserAvatarTabs } from './UserTabs/UserAvatarTabs';
import { UserAvatar } from './UserAvatar';
import { Icons } from '../../Icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';

export function UserAccountNav({ session }: any) {
  const isLoading = !session?.imageUrl;
  return (
    <TooltipProvider delayDuration={10}>
      <Tooltip>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            // disabled={session?.firstname ? false : true}
            // disabled={isLoading}
            className='select-none outline-none transition-transform duration-0 active:opacity-85 '
          >
            <TooltipTrigger asChild>
              <div className='active:scale-[98.5%] relative  rounded-full transition-transform duration-0 active:opacity-95 '>
                <UserAvatar session={{ firstname: session?.firstname, imageUrl: session?.imageUrl, asd: '' || null }} className='h-10 w-10 ' />
                <div className='absolute bottom-0 right-[.5px] bg-slate-100 border-white border-opacity-40 border rounded-full'>
                  <Icons.chevronDown className='h-3 w-3 stroke-[3px]' />
                </div>
              </div>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='bg-white'>
            <UserAvatarTabs />
            {/* <DropdownMenuSeparator /> */}
          </DropdownMenuContent>
        </DropdownMenu>

        <TooltipContent className='bg-white py-1 px-2'>
          <p className='text-sm'>Account</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
