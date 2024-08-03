'use client';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserAvatarTabs } from './UserTabs/UserAvatarTabs';
import { UserAvatar } from './UserAvatar';
import { Icons } from '../../Icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function UserAccountNav({ session }: any) {
  const isLoading = !session?.imageUrl;
  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            // disabled={session?.firstname ? false : true}
            // disabled={isLoading}
            className='select-none outline-none active:scale-[98%] transition-transform duration-100 active:opacity-85 '
          >
            <TooltipTrigger asChild>
              <div className='active:scale-[98%] relative active:drop-shadow-2xl transition-transform duration-100 active:opacity-85 '>
                <UserAvatar session={{ firstname: session?.firstname, imageUrl: session?.imageUrl, asd: '' || null }} className='h-10 w-10' />
                <div className='absolute bottom-[.7px] right-[.4px] bg-slate-200 rounded-full'>
                  <Icons.chevronDown className='h-3.5 w-3.5 stroke-[3px]' />
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
