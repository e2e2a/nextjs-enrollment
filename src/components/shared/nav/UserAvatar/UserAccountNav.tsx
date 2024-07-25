'use client';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserAvatarTabs } from './UserTabs/UserAvatarTabs';
import { UserAvatar } from './UserAvatar';

export function UserAccountNav({ session }: any) {
  const isLoading = !session?.imageUrl;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isLoading}
        className='select-none outline-none active:scale-[98%] transition-transform duration-100 active:opacity-85'
      >
        <div className='active:scale-[98%] transition-transform duration-100 active:opacity-85'>
          <UserAvatar
            session={{ firstname: session.firstname, imageUrl: session.imageUrl, asd: '' || null }}
            className='h-11 w-11 '
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='bg-white'>
        <UserAvatarTabs />
        {/* <DropdownMenuSeparator /> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
