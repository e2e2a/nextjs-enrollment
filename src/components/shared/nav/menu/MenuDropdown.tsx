'use client';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Icons } from '../../Icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';

export function MenuDropdown({ session }: any) {
  const isLoading = !session?.imageUrl;
  return (
    <TooltipProvider delayDuration={10}>
      <Tooltip>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            className='select-none outline-none transition-transform duration-0 active:opacity-85 rounded-full bg-slate-200 p-[6.5px]'
          >
            <TooltipTrigger asChild>
              <div className='active:scale-[98.5%] relative  rounded-full transition-transform duration-0 active:opacity-95 '>
                {/* <UserAvatar session={{ firstname: session?.firstname, imageUrl: session?.imageUrl, asd: '' || null }} className='h-10 w-10 ' /> */}
                <Icons.grip className='h-7 w-7 text-muted-foreground stroke-black' />
              </div>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='bg-white'>
            {/* <UserAvatarTabs /> */}
          </DropdownMenuContent>
        </DropdownMenu>

        <TooltipContent className='bg-white py-1 px-2 mt-2'>
          <p className='text-sm'>Menu</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
